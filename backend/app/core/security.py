from typing import Optional, List
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User


def get_current_user(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """
    Derives authenticated identity from request headers and verifies against database.
    Never trusts client role claims; identity and role are strictly fetched from database.
    """
    user_id = None

    if x_user_id:
        user_id = x_user_id.strip()
    elif authorization:
        parts = authorization.strip().split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            user_id = parts[1].strip()
        elif len(parts) == 1:
            user_id = parts[0].strip()

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide 'X-User-Id' or 'Authorization: Bearer <user_id>' header.",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: user '{user_id}' does not exist in the municipal system.",
        )

    return user


def require_roles(allowed_roles: List[str]):
    """
    Dependency factory enforcing strict role-based access control.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: User role '{current_user.role}' is not in authorized roles ({', '.join(allowed_roles)}).",
            )
        return current_user

    return role_checker
