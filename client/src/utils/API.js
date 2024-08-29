// route to get logged in user's info (needs the token)
export const getMe = async (token) => {
  try {
    const response = await fetch('/api/users/me', {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export async function createUser(userData) {
  try {
    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to login user');
    }

    return response.json();
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// save book data for a logged in user
export const saveBook = async (bookData, token) => {
  try {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error('Failed to save book');
    }

    return response.json();
  } catch (error) {
    console.error('Error saving book:', error);
    throw error;
  }
};

// remove saved book data for a logged in user
export const deleteBook = async (bookId, token) => {
  try {
    const response = await fetch(`/api/users/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }

    return response.json();
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// make a search to google books api
export const searchGoogleBooks = async (query) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);

    if (!response.ok) {
      throw new Error('Failed to search Google Books');
    }

    return response.json();
  } catch (error) {
    console.error('Error searching Google Books:', error);
    throw error;
  }
};