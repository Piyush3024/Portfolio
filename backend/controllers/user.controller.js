import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { username, email, first_name, last_name, phone, image, area_id } = req.body;

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { user_id: parseInt(userId) },
//       include: { 
//         role: true,
//         area: true
//       }
//     });

//     if (!existingUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // If updating username or email, check for uniqueness
//     if (username && username !== existingUser.username) {
//       const usernameExists = await prisma.user.findUnique({
//         where: { username }
//       });
//       if (usernameExists) {
//         return res.status(400).json({
//           success: false,
//           message: "Username already taken"
//         });
//       }
//     }

//     if (email && email !== existingUser.email) {
//       const emailExists = await prisma.user.findUnique({
//         where: { email }
//       });
//       if (emailExists) {
//         return res.status(400).json({
//           success: false,
//           message: "Email already registered"
//         });
//       }
//     }

//     // If updating area, check if it exists
//     if (area_id) {
//       const areaExists = await prisma.area.findUnique({
//         where: { area_id: parseInt(area_id) }
//       });
//       if (!areaExists) {
//         return res.status(400).json({
//           success: false,
//           message: "Area not found"
//         });
//       }
//     }

//     // Don't allow updating super_admin user by other users
//     if (existingUser.role.name === 'super_admin' && (!req.user || req.user.role.name !== 'super_admin')) {
//       return res.status(403).json({
//         success: false,
//         message: "Super admin users can only be updated by other super admins"
//       });
//     }

//     // Update user
//     const updatedUser = await prisma.user.update({
//       where: { user_id: parseInt(userId) },
//       data: {
//         ...(username && { username }),
//         ...(email && { email }),
//         ...(first_name && { first_name }),
//         ...(last_name && { last_name }),
//         ...(phone && { phone }),
//         ...(image && { image }),
//         ...(area_id && { area_id: parseInt(area_id) })
//       },
//       select: {
//         user_id: true,
//         username: true,
//         email: true,
//         first_name: true,
//         last_name: true,
//         phone: true,
//         image: true,
//         email_verified: true,
//         phone_verified: true,
//         is_blocked: true,
//         blocked_until: true,
//         created_at: true,
//         role: {
//           select: {
//             name: true
//           }
//         },
//         area: {
//           select: {
//             area_id: true,
//             name: true,
//             type: true,
//             ward_no: true,
//             city: {
//               select: {
//                 name: true,
//                 district: {
//                   select: {
//                     name: true,
//                     province: {
//                       select: {
//                         name: true
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     // If email is updated, set email_verified to false
//     if (email && email !== existingUser.email) {
//       await prisma.user.update({
//         where: { user_id: parseInt(userId) },
//         data: { email_verified: false }
//       });
//     }

//     res.json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser
//     });
//   } catch (error) {
//     console.error("Error in updateUser:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating user",
//       error: error.message
//     });
//   }
// };

export const deleteUser = async (req, res) => {
  try {
    const {userId} = req.params;
    await prisma.user.delete({
      where:{user_id: parseInt(userId)}
    });
    res.json({
      success:true,
      message:"User deleted successfully"
    })
  
  } catch (error) {
    console.error("Error in deleteUser controller:", error)
    res.status(500).json({
      success:false,
      message:"Error in deleteUser controller",
      error: error.message
    })
  }
  
}

// Block a user temporarily
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { blockDuration } = req.body; // Duration in hours

    if (!blockDuration || blockDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Block duration must be a positive number"
      });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(userId) },
      include: { role: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Don't allow blocking of super admins
    if (user.role.name === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: "Super admin users cannot be blocked"
      });
    }

    // Calculate block end time
    const blockedUntil = new Date();
    blockedUntil.setHours(blockedUntil.getHours() + blockDuration);

    // Update user's block status
    const updatedUser = await prisma.user.update({
      where: { user_id: parseInt(userId) },
      data: {
        is_blocked: true,
        blocked_until: blockedUntil
      },
      include: {
        role: true
      }
    });

    // Clear user's tokens from cookies in case they're currently logged in
    // res.clearCookie('accessToken');
    // res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: `User blocked successfully until ${blockedUntil.toISOString()}`,
      data: {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        is_blocked: updatedUser.is_blocked,
        blocked_until: updatedUser.blocked_until
      }
    });
  } catch (error) {
    console.error("Error in blockUser:", error);
    res.status(500).json({
      success: false,
      message: "Error blocking user",
      error: error.message
    });
  }
};

// Unblock a user
export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user's block status
    const updatedUser = await prisma.user.update({
      where: { user_id: parseInt(userId) },
      data: {
        is_blocked: false,
        blocked_until: null
      }
    });

    res.json({
      success: true,
      message: "User unblocked successfully",
      data: {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        is_blocked: updatedUser.is_blocked
      }
    });
  } catch (error) {
    console.error("Error in unblockUser:", error);
    res.status(500).json({
      success: false,
      message: "Error unblocking user",
      error: error.message
    });
  }
};

// Get blocked users
export const getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await prisma.user.findMany({
      where: {
        is_blocked: true
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        blocked_until: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: blockedUsers
    });
  } catch (error) {
    console.error("Error in getBlockedUsers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blocked users",
      error: error.message
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        
        phone: true,
       
        is_blocked: true,
        blocked_until: true,
        created_at: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};






// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        user_id: parseInt(userId)
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
      
        phone: true,

        is_blocked: true,
        blocked_until: true,
        created_at: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
};


export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        phone: true,
        is_blocked: true,
        blocked_until: true,
        created_at: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        phone: true,
        is_blocked: true,
        blocked_until: true,
        created_at: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error in getUserByUsername:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
}; 

