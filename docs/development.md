# Development

Any individual can create a free sandbox account with MongoDB Atlas here:
https://www.mongodb.com/cloud/atlas/register. This project uses the MongoDB
Atlas API (v2) to collect information about entities in your Atlas account. The
Atlas API is documented here:
https://www.mongodb.com/docs/atlas/reference/api-resources-spec/v2/.

## Provider account setup

Once you've created a new Atlas account and verified it via email, you will be
able to create an organization-level API key by following the steps in the
[MongoDB docs](https://www.mongodb.com/docs/atlas/configure-api-access/#create-an-api-key-in-an-organization).

When a new organization is created, Atlas enables the API access list
requirement by default. You will need to add the IP address of the machine
you're running this project on to the API access list or toggle the setting
`Require IP Access List for the Atlas Administration API` to `OFF`.

The organization-level API key should then be
[added to each Project](https://www.mongodb.com/docs/atlas/configure-api-access/#invite-an-organization-api-key-to-a-project).
You will need `Project Owner` access to add the API key to projects.

## Authentication

The API key configured in the step above will consist of a "private key" and a
"public key". Ensure that you've created a `.env` file in the root of the
project using the `.env.example` file as an example and populated the two
variables with the appropriate values.
