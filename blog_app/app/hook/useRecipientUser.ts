// import { useEffect, useState } from "react";

// import { getUserById } from "@/app/api/AuthApi";

// export const useFetchRecipientUser = (user) => {
//   const [recipientUser, setRecipientUser] = useState(null);

//   const recipientId = data?.member?.find((m) => m !== user);

//   useEffect(() => {
//     const getUser = async () => {
//       if (!recipientId) return null;
//       const response = await getUserById(recipientId);
//       if (response.error) {
//         console.error(response.error);
//       }
//       setRecipientUser(response.data.data);
//     };

//     getUser();
//   }, [recipientId]);

//   return { recipientUser };
// };
