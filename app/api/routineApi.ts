import axiosInstance from "@/lib/axiosInstance"

interface SkinCareRoutine {
  routineID: string
  skinType: string
  routineName: string
  routineDescription: string
}

// Get all skincare routines
export const fetchRoutines = async () => {
  try {
    const response = await axiosInstance.get("/skin-care-routines")
    return response.data
  } catch (error) {
    console.error("Error fetching routines:", error)
    throw error
  }
}

// Create a new skincare routine
export const createRoutine = async (routine: Omit<SkinCareRoutine, 'routineID'>) => {
  try {
    const response = await axiosInstance.post("/skin-care-routines", routine)
    return response.data
  } catch (error) {
    console.error("Error creating routine:", error)
    throw error
  }
}

// Get skincare routine by ID
export const fetchRoutineById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/skin-care-routines/${id}`)
    console.log("Get routine success")
    return response.data
  } catch (error) {
    console.error("Error fetching routine:", error)
    throw error
  }
}

// Update skincare routine
export const updateRoutine = async (id: string, routine: Partial<SkinCareRoutine>) => {
  try {
    const response = await axiosInstance.put(`/skin-care-routines/${id}`, routine)
    console.log("Update routine success")
    return response.data
  } catch (error) {
    console.error("Error updating routine:", error)
    throw error
  }
}

// Delete skincare routine
export const deleteRoutine = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/skin-care-routines/${id}`)
    console.log("Delete routine success")
    return response.data
  } catch (error) {
    console.error("Error deleting routine:", error)
    throw error
  }
}

// Get routines by category
export const fetchRoutinesBySkinType = async (skinType) => {
  try {
    const response = await axiosInstance.get(`/skin-care-routines/skinType/${skinType}`);
    console.log("Get routines by skin type success");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching routines by skin type:", error);
    throw error;
  }
};

// Search routines by name
export const searchRoutinesByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/skin-care-routines/search?name=${name}`)
    console.log("Search routines success", response.data.data)
    return response.data.data
  } catch (error) {
    console.error("Error searching routines:", error)
    throw error
  }
}

// Apply routine to user
export const applyRoutineToUser = async (userID: string, routineID: string) => {
  try {
    const response = await axiosInstance.post(
      `/skin-care-routines/${routineID}/apply-to-user/${userID}`
    );
    console.log("Routine applied successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error applying routine to user:", error);
    throw error;
  }
};

export const fetchRoutineByUserIdAndRoutineId = async (userID: string, routineID: string) => {
  try {
    const response = await axiosInstance.get(`/skin-care-routines/${routineID}/user/${userID}`);
    console.log("Get routine by user ID and routine ID success");
    return response.data;
  } catch (error) {
    console.error("Error fetching routine by user ID and routine ID:", error);
    throw error;
  }
};
