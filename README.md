# list-folders-action

## Description

`list-folders-action` is a GitHub Action that lists sub-folders of all the given paths and returns different formats of the found sub-folders.

## Inputs

| Name        | Description                                | Required | Default |
|-------------|--------------------------------------------|----------|---------|
| `paths`     | List of paths to search for sub-folders    | true     |         |
| `separator` | Separator of the paths list                | false    | `\n`    |

## Outputs

| Name                   | Description                                                                            |
|------------------------|----------------------------------------------------------------------------------------|
| `total`                | Number of total sub-folders                                                            |
| `folders`              | JSON array with all sub-folders found including base path                              |
| `folders_no_base_path` | JSON array with all sub-folders found without base path                                |
| `folders_by_path`      | JSON object where each key is the base path and contains an array with its sub-folders |

## Usage

Here's an example of how to use this action in a workflow:

```yaml
name: List Subfolders

on: [push]

jobs:
  list-subfolders-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: List subfolders
        id: list-subfolders
        uses: Drafteame/list-folders-action@main
        with:
          paths: |
            /path1
            /path2

      - name: Output total sub-folders
        run: echo "Total sub-folders: ${{ steps.list-subfolders.outputs.total }}"

      - name: Output folders with base path
        run: echo "Folders with base path: ${{ steps.list-subfolders.outputs.folders }}"

      - name: Output folders without base path
        run: echo "Folders without base path: ${{ steps.list-subfolders.outputs.folders_no_base_path }}"

      - name: Output folders by path
        run: echo "Folders by path: ${{ steps.list-subfolders.outputs.folders_by_path }}"
```

## Development

To build and test this action locally, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Drafteame/list-folders-action.git
   cd list-folders-action
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Run tests**:

   ```sh
   npm test
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
