from fastapi import APIRouter, HTTPException, UploadFile, File
import time
import uuid
import os

router = APIRouter()

ALLOWED_EXTENSIONS = {
    'png', 'jpg', 'jpeg', 'gif', 'webp',
    'pdf', 'docx', 'xlsx', 'zip'
}

IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

@router.post("")
async def upload_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    filename = file.filename or "file.dat"
    extension = filename.split(".")[-1].lower() if "." in filename else ""

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid file extension. Allowed formats: PDF, DOCX, XLSX, ZIP, PNG, JPG, WEBP."
        )

    folder = "images" if extension in IMAGE_EXTENSIONS else "uploads"
    new_filename = f"{int(time.time())}_{uuid.uuid4().hex[:8]}.{extension}"

    # Target frontend public/admin-uploads
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", ".."))
    frontend_upload_dir = os.path.join(project_root, "public", "admin-uploads", folder)
    os.makedirs(frontend_upload_dir, exist_ok=True)
    file_path = os.path.join(frontend_upload_dir, new_filename)

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Also save to backend local public for standalone testing
    backend_upload_dir = os.path.join("public", "admin-uploads", folder)
    try:
        os.makedirs(backend_upload_dir, exist_ok=True)
        with open(os.path.join(backend_upload_dir, new_filename), "wb") as f:
            f.write(contents)
    except Exception:
        pass

    url = f"/admin-uploads/{folder}/{new_filename}"

    return {
        "url": url,
        "name": filename,
        "size": len(contents)
    }

