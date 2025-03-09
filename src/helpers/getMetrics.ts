export const getUsersCount = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
        method: "GET",
        credentials: "include",
    });

    return response.json();
}

export const getProUsersCount = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/subscription/pro`, {
        method: "GET",
        credentials: "include",
    });

    return response.json();
}

export const getPremiumUsersCount = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/subscription/premium`, {
        method: "GET",
        credentials: "include",
    });
    
    return response.json();
}

export const getFreeUsersCount = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/subscription/free`, {
        method: "GET",
        credentials: "include",
    });

    return response.json();
}

export const getTotalSales = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/total/sales`, {
        method: "GET",
        credentials: "include",
    });

    return response.json();
}

export const getMonthlyRegistrations = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/metrics/registrations`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  };
  
  export const getMonthlySubscriptions = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/metrics/subscriptions`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  };
  