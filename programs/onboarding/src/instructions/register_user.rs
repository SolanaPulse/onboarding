use anchor_lang::prelude::*;

use crate::User;
#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + User::INIT_SPACE,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

impl<'info> RegisterUser<'info> {
    pub fn register_user(&mut self, bumps: &RegisterUserBumps) -> Result<()> {
        self.user_account.set_inner(User {
            user: self.user.key(),
            bump: bumps.user_account,
            is_initialized: true,
            created_at: Clock::get()?.unix_timestamp,
        });
        Ok(())
    }
}
