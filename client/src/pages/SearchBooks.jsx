import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const [savedBookIds, setSavedBookIds] = useState([]);

  useEffect(() => {
    if (data) {
      const savedBookIds = data.me.savedBooks.map((book) => book.bookId);
      setSavedBookIds(savedBookIds);
    }
  }, [data]);

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({ variables: { bookId } });
      setSavedBookIds(savedBookIds.filter((id) => id !== bookId));
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container fluid className="text-light bg-dark p-5">
      <Container>
        <h1>Saved Books</h1>
        <Row>
          {loading ? (
            <p>Loading...</p>
          ) : (
            data.me.savedBooks.map((book) => (
              <Col md="4" key={book.bookId}>
                <Card border="dark" className="mb-4">
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-info"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default SavedBooks;