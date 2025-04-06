import axiosInstance from "@/lib/axiosInstance";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  skinType: string;
  loyalPoints: number;
}

// Create a new customer
export const createCustomer = async (
  customerData: Omit<Customer, "id" | "loyalPoints">
) => {
  try {
    const response = await axiosInstance.post("/user", customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
};

// Get a customer by ID
export const fetchCustomerByID = async (userID: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userID}`);
    console.log("Get customer info success:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
};

// Update customer profile by ID
export const updateCustomer = async (userId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(`/user/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Update customer success");
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    return null;
  }
};

// export const updateCustomerSkinType = async (userId: string, data: { skinType: string }) => {
//   try {
//     const response = await axiosInstance.put(`/user/${userId}`, data);
//     console.log("Update customer success");
//     return response.data;
//   } catch (error) {
//     console.error("Error updating customer:", error);
//     return null;
//   }
// };
