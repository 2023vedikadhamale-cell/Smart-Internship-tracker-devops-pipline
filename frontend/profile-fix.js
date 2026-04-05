// Emergency Profile Fix - Paste this in browser console (F12 → Console)

console.log('🚀 Emergency Profile Fix Loading...');

// Function to force enable all form inputs
function forceEnableProfileInputs() {
  console.log('🔧 Force enabling all profile inputs...');

  // Remove disabled attribute from all form inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  let enabledCount = 0;

  inputs.forEach(input => {
    // Don't enable email field
    if (!input.type || input.type !== 'email') {
      input.disabled = false;
      input.readOnly = false;
      input.style.backgroundColor = '#ffffff';
      input.style.cursor = 'text';
      input.style.pointerEvents = 'auto';

      // Add focus styling
      input.addEventListener('focus', () => {
        input.style.borderColor = '#3b82f6';
        input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
      });

      enabledCount++;
    }
  });

  console.log(`✅ Enabled ${enabledCount} form inputs`);

  // Also try to set editing state via React DevTools if available
  try {
    // Look for React component fiber
    const profileElement = document.querySelector('form') || document.querySelector('[class*="card"]');
    if (profileElement && profileElement._reactInternalFiber) {
      console.log('🔍 Found React component, trying to set editing state...');
    }
  } catch (e) {
    console.log('⚠️ React DevTools method not available');
  }

  // Show success message
  const successDiv = document.createElement('div');
  successDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 10000;
      font-family: system-ui;
    ">
      ✅ Profile inputs enabled! You can now type in the fields.
    </div>
  `;
  document.body.appendChild(successDiv);

  // Remove success message after 3 seconds
  setTimeout(() => {
    document.body.removeChild(successDiv);
  }, 3000);
}

// Auto-run the fix
forceEnableProfileInputs();

console.log(`
🎯 Profile Fix Applied Successfully!

If inputs are still not working:
1. Try clicking in any text field
2. Try pressing Tab to navigate between fields
3. Run this command again: forceEnableProfileInputs()

📝 To add skills quickly, try typing and pressing Enter:
- JavaScript
- React
- Python
- HTML
- CSS
- Communication
`);

// Make the function available globally
window.forceEnableProfileInputs = forceEnableProfileInputs;