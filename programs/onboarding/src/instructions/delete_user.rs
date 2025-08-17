use anchor_lang::prelude::*;

use crate::User;

#[derive(Accounts)]
pub struct DeleteUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        close = user,
        has_one = user,
        seeds = [b"user", user.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

impl<'info> DeleteUser<'info> {
    pub fn delete_user(&mut self) -> Result<()> {
        self.user_account.close(self.user.to_account_info())?;
        Ok(())
    }
}
