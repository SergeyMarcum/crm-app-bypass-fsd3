# NonCompliancePage

This page displays a list of non-compliance items.
It allows users to:

- View a paginated list of non-compliances.
- Filter non-compliances by name.
- Add new non-compliance items.
- Edit existing non-compliance items (for authorized users).
- Delete non-compliance items.

## Components Used:

- `NonComplianceTable`: Displays the list of non-compliances.
- `AddNewNonComplianceModal`: Modal for adding a new non-compliance.
- `EditNonComplianceModal`: Modal for editing an existing non-compliance.
- `FilterNonComplianceModal`: Modal for filtering the non-compliance list.

## Data Flow:

- Non-compliance data is fetched from the backend using `nonComplianceApi`.
- State is managed using React's `useState` and `useEffect` hooks.
- User interactions (add, edit, delete, filter) trigger API calls and re-fetching of data to update the table.
