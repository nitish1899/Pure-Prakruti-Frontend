import {ipconfig} from "../../app/constants" ;


export function calculateResult(info) {
  return new Promise(async (resolve, reject) => {
    try{
    const response = await fetch(`https://api.pureprakruti.com/api/vehicle/findCO2Emission`, {
      method: "POST",
      body: JSON.stringify(info),
      headers: { "content-type": "application/json" },
    });
    
    if (response.ok) {
      const data = await response.json();
      // console.log('data: ',data);
      resolve({ data });
      
    } else {
      const error = await response.json();
      console.log('error: ',error);
      reject(error);
    }
    }catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

export function login(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try{
      // console.log(ipconfig)
    const response = await fetch(`https://api.pureprakruti.com/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(loginInfo),
      headers: { "content-type": "application/json" },
    });
    if (response.ok) {
    const data = await response.json();
    // console.log(data);
    resolve({ data });
  } else {
    const error = await response.json();
    // console.log(error);
    reject(error);
  }
  }catch (error) {
    // console.log(error);
    reject(error);

  }
  });
}

export function signup(signupInfo) {
  return new Promise(async (resolve, reject) => {
    try{
    const response = await fetch(`https://api.pureprakruti.com/api/auth/signup`, {
      method: "POST",
      body: JSON.stringify(signupInfo),
      headers: { "content-type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      resolve({ data });
    } else {
      const error = await response.text();
      reject(error);
    }
    }catch (error) {
      reject(error);
    }
});
}


export function verifyOtp(otp) {
  return new Promise(async (resolve, reject) => {
    try{
    const response = await fetch(`https://api.pureprakruti.com/api/otp/verify`, {
      method: "POST",
      body: JSON.stringify(otp),
      headers: { "content-type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      resolve({ data });
    } else {
      const error = await response.text();
      reject(error);
    }
    }catch (error) {
      reject(error);
    }
});
}

export function sendNumber(number) {
  return new Promise(async (resolve, reject) => {
    try{
    const response = await fetch(`https://api.pureprakruti.com/api/otp/send`, {
      method: "POST",
      body: JSON.stringify(number),
      headers: { "content-type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      resolve({ data });
    } else {
      const error = await response.text();
      reject(error);
    }
    }catch (error) {
      reject(error);
    }
});
}



























































// export function otpLogin(loginNumber) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await fetch("https://ranaadmin.anujdwivedi.in/ownerapi/v1/otp-login", {
//         method: "POST",
//         body: loginNumber,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
        
//         resolve({ data });
//       } else {
//         const error = await response.text();
//         reject(error);
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// export function verifyOtp(verifyCredentials) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await fetch("https://ranaadmin.anujdwivedi.in/ownerapi/v1/verify-otp", {
//         method: "POST",
//         body: verifyCredentials,
//        });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
        
//         resolve({ data });
//       } else {
//         const error = await response.text();
//         reject(error);
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// export function getAgents(verifyCredentials) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await fetch("https://ranaadmin.anujdwivedi.in/ownerapi/v1/getAgents", {
//         method: "GET",
//         body: verifyCredentials,
//         // headers: { "content-type": "application/json" },
//         headers: {
//           // 'Content-Type': 'application/json',
//           'Authorization': `bearer token 642|oHmou0dP0KuklXibmDlkR3J271KVgVHNw7tSzy0Scc86b51a`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
        
//         resolve({ data });
//       } else {
//         const error = await response.text();
//         reject(error);
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// }