const userId = 'use';

function loadProfile() {
  const data = localStorage.getItem(`profile_${userId}`);
  const displayName = document.getElementById('firstname');
  const displayEmail = document.getElementById('display-email');
  const profileDisplay = document.getElementById('profile-display');
  const createProfileForm = document.getElementById('create-profile-form');
  
  console.log('Loading profile...');
  
  if (data) {
    const profile = JSON.parse(data);
    console.log("Loaded Profile:", profile);
    if (displayName) displayName.textContent = profile.firstname;
    if (displayEmail) displayEmail.textContent = profile.email;
    if (profileDisplay) profileDisplay.classList.remove('hidden');
  } else {
    console.log('No profile found, showing create form.');
    if (createProfileForm) createProfileForm.classList.remove('hidden');
  }
}
      
      
      // Create Profile
      function createProfile() {
        const firstname = document.getElementById('input-firstname').value;
        const middlename = document.getElementById('middlename').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('phone').value;
        const birthdate = document.getElementById('birthdate').value;
        const gender = document.getElementById('gender').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;

        document.getElementById('create-profile-form').scrollIntoView({ behavior: 'smooth' });
      
        const formMessage = document.getElementById('form-message');
        if (!firstname || !lastname || !email || !phone || !birthdate || !gender || !state || !city || !zip) {
          formMessage.textContent = 'Please fill in all required fields.';
          formMessage.classList.remove('hidden');
          formMessage.classList.add('error');
          document.getElementById('create-profile-form').scrollIntoView({ behavior: 'smooth' });
          return;
        } else {
        formMessage.textContent = '';
        formMessage.classList.add('hidden');
        formMessage.classList.remove('error');
        }
      
        const profile = {
          firstname,
          middlename,
          lastname,
          email,
          phone,
          birthdate,
          gender,
          city,
          state,
          zip
        };
      
        console.log("Registered Profile:", profile);
      
        localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
        location.reload();
      }
      

      function showEditForm() {
        // Make sure profileDisplay is defined
        const profileDisplay = document.getElementById('profile-display');
        const editForm = document.getElementById('edit-form');
      
        // Get the profile data from localStorage
        const data = JSON.parse(localStorage.getItem(`profile_${userId}`));
        console.log('Editing Profile:', data);
      
        // Populate the edit form with the profile data
        document.getElementById('edit-firstname').value = data.firstname || '';
        document.getElementById('edit-middlename').value = data.middlename || '';  
        document.getElementById('edit-lastname').value = data.lastname || '';
        document.getElementById('edit-email').value = data.email || '';
        document.getElementById('edit-phone').value = data.phone || '';  
        document.getElementById('edit-birthdate').value = data.birthdate || '';  
        document.getElementById('edit-gender').value = data.gender || '';  
        document.getElementById('edit-city').value = data.city || '';  
        document.getElementById('edit-state').value = data.state || '';  
        document.getElementById('edit-zip').value = data.zip || '';  
      
        // Hide the profile display and show the edit form
        if (profileDisplay) profileDisplay.classList.add('hidden');
        if (editForm) editForm.classList.remove('hidden');
      }
      
      
      // Save edited profile
      function saveEdits() {
        const formMessage = document.getElementById('edit-form-message');
        
        // Grab form field values
        const firstname = document.getElementById('edit-firstname').value.trim();
        const middlename = document.getElementById('edit-middlename').value.trim();
        const lastname = document.getElementById('edit-lastname').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const phone = document.getElementById('edit-phone').value.trim();
        const gender = document.getElementById('edit-gender').value;
        const city = document.getElementById('edit-city').value.trim();
        const state = document.getElementById('edit-state').value.trim();
        const zip = document.getElementById('edit-zip').value.trim();
      
        // Check for required fields
        if (!firstname || !lastname || !email || !phone || !gender || !state || !city || !zip) {
          formMessage.textContent = 'Please fill in all required fields.';
          formMessage.classList.remove('hidden');
          formMessage.classList.add('error');
          editForm.scrollIntoView({ behavior: 'smooth' });
          return;
        } else {
          formMessage.textContent = '';
          formMessage.classList.add('hidden');
          formMessage.classList.remove('error');
        }
      
        // Get existing profile data and update it
        const oldData = JSON.parse(localStorage.getItem(`profile_${userId}`));
        
        const updatedProfile = {
          ...oldData,
          firstname,
          middlename,
          lastname,
          email,
          phone,
          gender,
          city,
          state,
          zip
        };
      
        // Save updated profile to localStorage
        localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedProfile));
        
        // Reload profile (or update display dynamically as needed)
        location.reload();
      }
    
      function loadRegistrationSummary() {
        const summaryContent = document.getElementById('summary-content');
        const regSummary = document.getElementById('registration-summary');
        const data = localStorage.getItem(`registration_${userId}`);
      
        if (!data) {
          summaryContent.innerHTML = '<p>No registration found.</p>';
        } else {
          const reg = JSON.parse(data);
          summaryContent.innerHTML = `
            <p><strong>First Time Attending:</strong> ${reg.firstTime}</p>
            <p><strong>Student:</strong> ${reg.isStudent}</p>
            <p><strong>Submit Research:</strong> ${reg.submitResearch}</p>
            <p><strong>Title:</strong> ${reg.title}</p>
            <p><strong>Co-Authors:</strong> ${reg.coAuthors}</p>
            <p><strong>Abstract:</strong> ${reg.abstract}</p>
            <p><strong>Research Area:</strong> ${reg.researchArea}</p>
            <p><strong>Include in Proceedings:</strong> ${reg.includeInProceedings}</p>
          `;
        }
      
        regSummary.classList.remove('hidden');
        regSummary.scrollIntoView({ behavior: 'smooth' });
      }

      function deleteProfile() {
        if (confirm('Are you sure you want to delete your profile?')) {
          localStorage.removeItem(`profile_${userId}`);
          location.reload();
        }
      }

      function getRadioValue(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : 'Not specified';
      }

      document.addEventListener('DOMContentLoaded', () => {
        const userId = 'use'; // Define your user ID
      
        // Elements
        // const profileForm = document.getElementById('create-profile-form');
        const regForm = document.getElementById('create-profile-form');
        const profileDisplay = document.getElementById('profile-display');
        const editForm = document.getElementById('edit-form');
        const registerBtn = document.getElementById('register-btn');
        const editBtn = document.getElementById('edit-btn');
        const saveBtn = document.getElementById('save-btn');
        const deleteBtn = document.getElementById('delete-btn');
        const displayName = document.getElementById('firstname');
        const displayEmail = document.getElementById('display-email');
        const startRegBtn = document.getElementById('start-registration-btn');
        const registrationContainer = document.getElementById('registration-form-container');
        const welcomeScreen = document.getElementById('welcome-screen');
        const regFormEl = document.getElementById('sobie-registration-form');
        const summaryContent = document.getElementById('summary-content');
        const regSummary = document.getElementById('registration-summary');
        const backToProfileBtn = document.getElementById('back-to-profile');
        const manageRegBtn = document.getElementById('manage-registration-btn');
        const birthdateInput = document.getElementById('birthdate');
      
        // Set max birthdate
        if (birthdateInput) {
          const today = new Date().toISOString().split('T')[0];
          birthdateInput.max = today;
        }
      
        // Event Listeners
        if (registerBtn) registerBtn.addEventListener('click', createProfile);
        if (editBtn) editBtn.addEventListener('click', showEditForm);
        if (saveBtn) saveBtn.addEventListener('click', saveEdits);
        if (deleteBtn) deleteBtn.addEventListener('click', deleteProfile);
      
        if (manageRegBtn) {
          manageRegBtn.addEventListener('click', () => {
            profileDisplay.classList.add('hidden');
            loadRegistrationSummary();
          });
        }
      
        if (backToProfileBtn) {
          backToProfileBtn.addEventListener('click', () => {
            regSummary.classList.add('hidden');
            profileDisplay.classList.remove('hidden');
            profileDisplay.scrollIntoView({ behavior: 'smooth' });
          });
        }
      
        if (startRegBtn) {
          startRegBtn.addEventListener('click', () => {
              if (welcomeScreen) welcomeScreen.classList.add('hidden');
              if (profileDisplay) profileDisplay.classList.add('hidden');
              if (regForm) regForm.classList.add('hidden');
  
              if (registrationContainer) {
                  registrationContainer.classList.remove('hidden');
                  registrationContainer.scrollIntoView({ behavior: 'smooth' });
              }
          });
      }
      
        if (regFormEl) {
          regFormEl.addEventListener('submit', function (e) {
            e.preventDefault();
      
            const getValue = (id) => {
              const el = document.getElementById(id);
              if (!el) {
                console.warn(`Missing element with id "${id}"`);
                return '';
              }
              return el.value;
            };

            
            
            const regData = {
              firstTime: getRadioValue('first-time'),
              isStudent: getRadioValue('is-student'),
              submitResearch: getRadioValue('submit-research'),
              title: document.getElementById('submission-title').value,
              coAuthors: getRadioValue('co-authors'),
              abstract: document.getElementById('submission-abstract').value,
              researchArea: document.getElementById('research-area').value,
              includeInProceedings: getRadioValue('include-in-proceedings')
            };
      
            localStorage.setItem(`registration_${userId}`, JSON.stringify(regData));
            alert('Registration saved!');
            registrationContainer.classList.add('hidden');
            loadRegistrationSummary();
          });
        }
      
        loadProfile(); // Call after listeners are attached
      });
      