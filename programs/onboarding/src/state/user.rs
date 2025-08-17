use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct User {
    pub user: Pubkey,
    pub bump: u8,
    pub is_initialized: bool,
    pub created_at: i64,
}
