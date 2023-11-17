## UI Testing

### Test Scenario: Admin User "Happy Path"

This scenario outlines a series of steps that an admin user typically performs on your application, from registration to managing listings.

#### Steps:

1. **Registering as an Admin (`/register`):**
   - **Description:** Test the registration process for an admin user.
   - **Rationale:** Ensures that admins can gain access to the application.
2. **Creating a New Listing (`/create-listings`):**
   - **Description:** Test if the admin can successfully create a new listing.
   - **Rationale:** Creating listings is a fundamental feature for admins.
3. **Updating Listing Details (`/edit-listings/:id`):**
   - **Description:** Test the ability of the admin to update listing details.
   - **Rationale:** Ability to edit listings is crucial for keeping information accurate and up-to-date.
4. **Publishing a Listing (Part of `/hosted-detail/:id`):**
   - **Description:** Test the process of making a listing publicly visible.
   - **Rationale:** Publishing listings is key for making them available to users.
5. **Unpublishing a Listing (Part of `/hosted-detail/:id`):**
   - **Description:** Test the admin's ability to remove a listing from public view.
   - **Rationale:** Unpublishing allows for control over which listings are currently available.
6. **Making a Booking (`/detail/:id`):**
   - **Description:** Simulate a booking process for a listing.
   - **Rationale:** Ensures that booking functionality is operational for all users, including admins.
7. **Logging Out (`/logout` - button interaction):**
   - **Description:** Test the logout process for an admin.
   - **Rationale:** Secure and proper logout functionality is crucial for maintaining session security.
8. **Logging Back In (`/login`):**
   - **Description:** Test if the admin can successfully re-enter the application.
   - **Rationale:** Checks for persistent and continuous access across sessions.

### Rationale of Testing:

This "happy path" testing follows a logical sequence of actions an admin user would perform, ensuring all major functionalities are operational. This approach provides a comprehensive assessment of the application's performance under normal usage conditions, highlighting critical areas for improvement.

### Additional Test Scenario: Regular User "Happy Path"

This scenario describes a sequence of steps performed by a regular user, encompassing the experience of searching, booking, and reviewing a listing.

#### Steps:

1. **User Registration (`/register`):**
   - **Description:** Test the registration process for a regular user.
   - **Rationale:** Ensures new users can create accounts and access the application.
2. **Browsing Listings (`/all-listings`):**
   - **Description:** Test if the user can view and browse through all listings.
   - **Rationale:** Verifies that users can explore available listings.
3. **Viewing a Specific Listing (`/detail/:id`):**
   - **Description:** Test the functionality of viewing detailed information about a specific listing.
   - **Rationale:** Ensures users can access detailed information about listings before making decisions.
4. **Making a Booking (`/detail/:id`):**
   - **Description:** Simulate the process of making a booking for a selected listing.
   - **Rationale:** Tests the core functionality of booking a stay.
5. **Leaving a Review (Part of `/detail/:id`):**
   - **Description:** Test the process of leaving a review for a booked listing.
   - **Rationale:** Reviews are an essential part of user feedback and influence future bookings.
6. **Logging Out and Back In (`/logout` & `/login`):**
   - **Description:** Verify that the user can successfully log out and log back into the application.
   - **Rationale:** Ensures the integrity and security of user sessions.

### Rationale of Testing:

This test scenario for a regular user covers the critical aspects of the user journey within the application, from registration to reviewing a listing. It provides a comprehensive overview of how users interact with various functionalities, ensuring a seamless and intuitive experience. The rationale behind this approach is to test the application from the perspective of an everyday user, which helps in identifying potential issues and areas for improvement in the user experience.