from pydantic import BaseModel, Field

class NetworkRequest(BaseModel):
    num_core: int = Field(default=5, description="Number of core banks")
    num_periphery: int = Field(default=45, description="Number of periphery banks")
    seed: int = Field(default=42, description="Random seed for reproducibility")


class ShockRequest(BaseModel):
    num_core: int = Field(default=5, description="Number of core banks")
    num_periphery: int = Field(default=45, description="Number of periphery banks")
    seed: int = Field(default=42, description="Random seed for reproducibility")
    shocked_bank_id: int = Field(default=0, description="ID of the bank receiving shock")
    shock_multiplier: float = Field(default=0.05, description="Percentage of extra assets retained (e.g. 0.05 = 95% asset loss)")
