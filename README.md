# Onboarding Program

This program manages user accounts, allowing users to register and delete their accounts.

**_Instructions_**

#### register_user()

- Creates a new user account.
- The user must sign the transaction.
- A new account is created using the user's public key as the seed.

#### Usage

- Call `register_user()` function.
- Pass the user's public key.
- Account is created with necessary space and initialization data.

#### delete_user()

- Deletes an existing user account.
- The user must sign the transaction.
- The account's funds are sent back to the user.

#### Usage

- Call `delete_user()` function.
- User account is closed, and lamports are returned to the user.

programId - H6Tu1mdhvE5VLseAW16y3aKWcwHqMT6S7Wjn9yQN56Ws

update user with a user have some devnet SOL to pass the test cases
