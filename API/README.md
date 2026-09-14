# DummyJSON API Test Collection

Automated API tests against the [DummyJSON](https://dummyjson.com/) REST API, built in Postman.

## Structure

```
DummyJSON.postman_collection.json   # the collection (5 folders, run top to bottom)
DummyJSON.postman_environment.json  # environment variables
```

Each folder is a self-contained test case: request = the call under test, the `test` script =
assertions, and collection/environment variables = the only thing passed between folders.

| # | Folder | What it does |
|---|--------|--------------|
| 1 | 1-Successful login | Picks a user from existing ones, logs in, stores the JWT for tests that needed. In this project no endpoint requires authentication |
| 2 | 2-Get Product and validate its content | From existing products picks one to validate its schema (the expected JSON Schema is passed as variable input when collection is executed). Additionally, it stores at least 3 products for next test |
| 3 | 3-For user, create a cart and validate | For the picked user, creates a cart with **at least 3** products, validates totals. If there are less than 3 products the request is Skipped |
| 4 | 4-Delete operation | Deletes a product, validates the response identity |
| 5 | 5-Negative scenarios | Invalid categories, wrong methods, bad date formats |

Folders 1-4 are ordered and dependent; folder 5 is independent and can be run on its own.

## Skips

A pre-request guard that calls `pm.execution.skipRequest()` is paired with
`pm.test.skip('reason')`.  The scenarios that evaluate precondition are:
| # | Test |Skip reason |
|---|--------|--------------|
| 1 | Get Token for User | When there are no users to authenticate, token cannot be created |
|2|Get a single Product and validate schema| If there are no products, it is not possible to get its details or validate its schema|
|3|Create cart with at least 3 products|If there are less than 3 products, the Cart is not created|
|4|Delete a Product| If there are no products, it is not possible to delete it|


## Notes

- AI (Claude) was used for general checks like variables consistency, verify naming conventions, to generate the response schema and to generate documentation (description inside the collection)
