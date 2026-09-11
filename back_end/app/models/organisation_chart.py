from sqlalchemy import Column, Integer, String, Text, SmallInteger, JSON, ForeignKey
from app.core.database import Base


class DesignationHierarchy(Base):
    __tablename__ = "designation_hierarchy"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    level = Column(Integer, default=1)
    status = Column(SmallInteger, default=1)


class OrgChargeMaster(Base):
    __tablename__ = "org_charge_master"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(JSON, nullable=False)  # {"default": "...", "hi": "..."}
    status = Column(SmallInteger, default=1)


class OrgReportingTo(Base):
    __tablename__ = "org_reporting_to"

    id = Column(Integer, primary_key=True, index=True)
    org_charge_master_id = Column(Integer, nullable=False)
    reporting_to_id = Column(Integer, nullable=False)


class NoteDisplayText(Base):
    __tablename__ = "note_display_text"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    module_id = Column(Integer, default=1)
    status = Column(SmallInteger, default=1)


class OrganisationChart(Base):
    __tablename__ = "organisation_chart"

    id = Column(Integer, primary_key=True, index=True)
    designation_hierarchy_id = Column(Integer, ForeignKey("designation_hierarchy.id"), nullable=True)
    full_name = Column(JSON, nullable=False)  # {"default": "Shri ...", "hi": "..."}
    email = Column(String, nullable=True)
    mobile_no = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    org_charge_master_id = Column(Integer, ForeignKey("org_charge_master.id"), nullable=True)
    additional_charge = Column(JSON, nullable=True)
    display_order = Column(Integer, default=0)
    seniority_confirmed = Column(SmallInteger, default=1)
    retired = Column(SmallInteger, default=0)
    status = Column(SmallInteger, default=1)
    language = Column(String, default="en")
