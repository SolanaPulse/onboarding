pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("H6Tu1mdhvE5VLseAW16y3aKWcwHqMT6S7Wjn9yQN56Ws");

#[program]
pub mod onboarding {
    use super::*;

    pub fn register_user(ctx: Context<RegisterUser>) -> Result<()> {
        ctx.accounts.register_user(&ctx.bumps)?;
        Ok(())
    }
    pub fn delete_user(ctx: Context<DeleteUser>) -> Result<()> {
        ctx.accounts.delete_user()?;
        Ok(())
    }
}
