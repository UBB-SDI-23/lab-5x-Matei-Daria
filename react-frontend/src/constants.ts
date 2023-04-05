const PROD_BACKEND_API_URL = "/api";
const DEV_BACKEND_API_URL = "ec2-13-53-131-107.eu-north-1.compute.amazonaws.com/api";

export const BACKEND_API_URL =
	process.env.NODE_ENV === "development" ? DEV_BACKEND_API_URL : PROD_BACKEND_API_URL;
