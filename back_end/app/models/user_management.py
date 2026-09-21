from sqlalchemy import Column, Integer, BigInteger, SmallInteger, String, Text, DateTime, ForeignKey, Boolean
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    role_id = Column(Integer, nullable=True)
    kms_categories_id = Column(Integer, nullable=True)
    circular_categories_id = Column(Integer, nullable=True)
    wings_id = Column(Integer, nullable=True)
    username = Column(String, unique=True, nullable=True, index=True)
    password = Column(String, nullable=True)
    mobile = Column(String, nullable=True)
    email = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    middle_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    name = Column(Text, nullable=True)
    full_name = Column(Text, nullable=True)
    avatar = Column(Text, nullable=True)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    status = Column(SmallInteger, default=1)
    fp_token = Column(Text, nullable=True)
    fp_token_at = Column(Text, nullable=True)
    login_token = Column(String, nullable=True)
    login_token_at = Column(DateTime, nullable=True)
    rand_no = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, nullable=True)
    modified_at = Column(DateTime, nullable=True)
    modified_by = Column(BigInteger, nullable=True)
    is_first_login = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    posted_office = Column(String, nullable=True)
    icisa_member_type = Column(String, nullable=True)
    country_id = Column(Integer, nullable=True)
    organisation = Column(String, nullable=True)
    icisa_member_grade = Column(String, nullable=True)


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, nullable=True, default=0)
    lft = Column(Integer, nullable=True)
    rght = Column(Integer, nullable=True)
    name = Column(Text, nullable=False)
    status = Column(SmallInteger, default=1)
    is_system = Column(SmallInteger, default=0)
    is_display = Column(SmallInteger, default=1)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=True)
    modified_by = Column(Integer, nullable=True)
    modified_at = Column(DateTime, nullable=True)


class RolePermission(Base):
    __tablename__ = "roles_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, nullable=False)
    website_id = Column(Integer, nullable=True, default=0)
    state_id = Column(Integer, nullable=True, default=0)
    department_id = Column(Integer, nullable=True, default=0)


class UserOffice(Base):
    __tablename__ = "user_offices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    language = Column(String, nullable=True, default="en")
    location = Column(String, nullable=True)
    status = Column(SmallInteger, default=1)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    module_name = Column(String, nullable=False)
    prefix = Column(String, nullable=True)
    plugin = Column(String, nullable=True)
    controller = Column(String, nullable=True)
    action = Column(String, nullable=True)
    sub_actions = Column(String, nullable=True)
    status = Column(SmallInteger, default=1)
    created_at = Column(DateTime, nullable=True)
    modified_at = Column(DateTime, nullable=True)


class AuditTrailLog(Base):
    __tablename__ = "audit_trail_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String, nullable=True)
    action_status = Column(String, nullable=True)
    username_email = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    data = Column(Text, nullable=True)
    table_alias = Column(String, nullable=True)
    action_datetime = Column(DateTime, default=datetime.utcnow)


class Wing(Base):
    __tablename__ = "wings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(SmallInteger, default=1)
    created = Column(DateTime, default=datetime.utcnow)
    modified = Column(DateTime, nullable=True)
    created_by = Column(Integer, nullable=True)
    modified_by = Column(Integer, nullable=True)


class Website(Base):
    __tablename__ = "websites"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, nullable=True, default=0)
    title = Column(Text, nullable=False)
    title_hi = Column(String, nullable=True)
    state_title = Column(String, nullable=True)
    state_title_hi = Column(String, nullable=True)
    state_image = Column(String, nullable=True)
    url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    theme = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    state_id = Column(Integer, nullable=True, default=0)
    department_id = Column(Integer, nullable=True, default=0)
    status = Column(SmallInteger, default=1)
    is_system = Column(SmallInteger, default=0)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=True)
    modified_by = Column(Integer, nullable=True)
    modified_at = Column(DateTime, nullable=True)


class PasswordHistory(Base):
    __tablename__ = "password_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False)
    user_type = Column(String, nullable=False, default="1")
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LoginAttempt(Base):
    __tablename__ = "login_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=True)
    username = Column(String, nullable=True)
    pwd = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    attempt_at = Column(DateTime, default=datetime.utcnow)
