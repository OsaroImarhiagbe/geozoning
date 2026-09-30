from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.infrastructure.models.auth_credentials import Auth_Credentials


class AuthRepositories:
    """
    Auth Service Data Acces Layer
    """
    def __init__(self,db:AsyncSession):
        self.__db = db
    
    async def grab_user_by_email(self,email:str):
        """ 
        Data Layer: function will check auth_credentials table for user by email
        """

        ## Look into what would happened if query based of email( like if email has an index)
        response = await self.__db.execute(select(
             Auth_Credentials.user_id,
             Auth_Credentials.email,
             Auth_Credentials.hashed_password,
             Auth_Credentials.email_verified,
             Auth_Credentials.role
             )
             .where(Auth_Credentials.email == email))
        
     
        user = response.scalar_one_or_none()

    

        return user or None
    
    async def create_user(self, email: str, hashed_password: str):
        """
        Data Layer:

        Function used to insert data into user_profiles table upon user creation.
        Raises:
            ValueError: if the email already exists
            RuntimeError: if a database or unexpected error occurs
        """


        new_user = Auth_Credentials(email=email, hashed_password=hashed_password)
        self.__db.add(new_user)
        await self.__db.commit()
        await self.__db.refresh(new_user)


        # guard check all db-generated fields at once
        if any(field is None for field in [new_user.user_id, new_user.created_at, new_user.updated_at,new_user.role, new_user.email_verified]):
            raise RuntimeError("User was inserted but one or more DB-generated fields were not returned")
                    
        return new_user
