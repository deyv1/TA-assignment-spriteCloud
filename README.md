# Test Automation Repository

This repository contains two independent, automated test suites — an **API**
suite and a **UI** suite — plus a single GitHub Actions pipeline that runs
both.

```
.github/
  agents/          -> repo automation / agent configuration
  env/              -> environment-specific values consumed by the pipeline
  workflows/
    test-suite.yml -> the one CI pipeline definition for this repo
API/                -> Postman + Newman API test suite (DummyJSON API)
UI/                 -> Playwright UI test suite (SauceDemo)
```

Each suite is self-contained (its own `.gitignore`, its own `README.md`) and
can be run independently, locally or in CI. This root README covers how the
two suites fit together and how the pipeline is wired.

## API suite (`API/`)

Postman/Newman-based API test suite targeting the DummyJSON API.

```
API/
  collections/
    DummyJSON.postman_collection.json   -> requests + assertions (Postman Collection)
  environments/
    DummyJSON.postman_environment.json  -> base URL / variables for the collection
  newman-report/                        -> generated test report output (not committed)
```

- `collections/` holds the exported Postman collection: the requests and
  their embedded test scripts (assertions).
- `environments/` holds the Postman environment file: base URL and any other
  variables the collection's requests depend on.
- `newman-report/` is where Newman (Postman's CLI runner) writes its report
  when the collection is executed in CI or locally — this is generated
  output, not source, and should stay out of version control.



## UI suite (`UI/`)

Playwright UI test suite targeting SauceDemo, split into four layers so each
file has a single responsibility:

```
UI/
  pages/     -> Page Objects: locators + atomic actions for one page
  flows/     -> Business layer: composes Page Objects into reusable journeys
  specs/     -> Test logic: test intent, test data, assertions
  support/   -> Cross-cutting infrastructure: env config, shared constants
```



## CI/CD pipeline

The whole repository is driven by **one** GitHub Actions workflow file:
`.github/workflows/test-suite.yml`. There is intentionally no separate
workflow per suite — API and UI both run out of this single pipeline
definition, as separate jobs/steps within it.

At a high level, the pipeline:
1. Checks out the repository.
2. Sets up Node.js and installs each suite's dependencies (`API/`, `UI/`).
3. Runs the API suite via Newman against the checked-in Postman collection
   and environment.
4. Runs the UI suite via Playwright, using the storage-state / auth setup
   project defined in `UI/playwright.config.ts`.
5. Publishes the resulting reports (Newman HTML report, Playwright HTML
   report) as pipeline artifacts.

> The exact trigger events, job names, and step order live in
> `test-suite.yml` itself — treat that file as the source of truth; this
> README describes intent, not a line-by-line mirror of it.

### Secrets and variables

No credentials, base URLs, or other environment-specific values are
hardcoded anywhere in `API/` or `UI/`. Everything is injected at pipeline
runtime as environment variables, configured in the repo's
**Settings → Secrets and variables → Actions**:

- **Secrets** — for values that must never be visible in logs or the repo
  (passwords, tokens). Referenced in the workflow as `${{ secrets.NAME }}`.
- **Variables** — for non-sensitive, still-environment-specific values
  (base URLs, usernames). Referenced as `${{ vars.NAME }}`.

For the **UI suite**, `UI/support/env.ts` requires these at runtime and
throws immediately with a clear error if any is missing:

| Name                  | Purpose                                    |
|------------------------|---------------------------------------------|
| `BASE_URL_UI`          | SauceDemo base URL the tests navigate to    |
| `STANDARD_PASSWORD`    | Password for the `standard_user` demo login |
| `LOCKED_OUT_PASSWORD`  | Password for the `locked_out_user` demo login |



For the **API suite**, the Postman environment file
(`API/environments/DummyJSON.postman_environment.json`) defines the
variables the collection expects (e.g. the DummyJSON base URL). Where a
value shouldn't be committed as a plain environment value, the pipeline
overrides it at runtime via Newman's `--env-var NAME=value` flag, sourced
from the same repo secrets/variables.



> As with the pipeline steps above: the authoritative list of which secrets
> and variables actually exist for this repo lives in **Settings → Secrets
> and variables → Actions**