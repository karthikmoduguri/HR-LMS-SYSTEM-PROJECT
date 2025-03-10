export const generateCandidateId = () => {
    return `CAND-${Math.floor(1000 + Math.random() * 9000)}`; 
  };
  
  export const generatePassword = () => {
    return Math.random().toString(36).slice(-8); 
  };
  