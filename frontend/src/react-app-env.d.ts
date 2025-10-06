/// <reference types="react-scripts" />
/// <reference types="react-scripts" />

interface ProcessEnv {
    readonly REACT_APP_API_URL: string;
  }
  
  interface NodeJS {
    readonly env: ProcessEnv;
  }
  