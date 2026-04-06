from pydantic import BaseModel

class NewUsers(BaseModel): 
    firstName: str
    lastName: str
    email: str
    password: str

class LogUsers(BaseModel):
    email: str
    password: str 

class Message(BaseModel):
    chat_id: int
    user_id: int
    message: str
