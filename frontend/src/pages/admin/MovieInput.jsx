import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import Sidebar from '../../components/Sidebar';

const MovieInputPage = () => {
  const [title, setTitle] = useState('');
  const [altTitle, setAltTitle] = useState('');
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [synopsis, setSynopsis] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trailer, setTrailer] = useState('');
  const [poster, setPoster] = useState('');
  const [posterLink, setPosterLink] = useState('');
  const [error, setError] = useState({});
  const requiredMessage = "This field is required";

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all') // API publik untuk daftar negara
      .then((res) => res.json())
      .then((data) => {
        // Format data negara dan urutkan secara ascending berdasarkan nama negara
        const sortedCountries = data
          .map((country) => ({
            name: country.name.common, 
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Mengurutkan berdasarkan nama

        setCountries(sortedCountries);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/genres/add-movie'); // Ganti URL jika berbeda
        const data = await response.json();
        setGenres(data); // Set data genre dari API
        console.log("Fetched genres:", data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);
 
  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults([]);
      return;
    }

    const fetchActors = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/actors/add-movie?name=${searchTerm}`);
        const data = await response.json();
        setSearchResults(data); // Simpan hasil pencarian di state
        console.log('Fetched Actors:', data);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    const debounceFetch = setTimeout(fetchActors, 300); // Tunggu 300ms sebelum fetch

    return () => clearTimeout(debounceFetch); // Clear timeout jika searchTerm berubah
  }, [searchTerm]);

  // Menangani perubahan checkbox
  const handleGenreChange = (id_genre) => {
    setSelectedGenres((prevGenres) => {

      if (prevGenres.includes(id_genre)) {
        // Hapus id_genre dari selectedGenres
        const updatedGenres = prevGenres.filter((genre) => genre !== id_genre);
        return updatedGenres;
      } else {
        // Tambahkan id_genre ke selectedGenres
        const updatedGenres = [...prevGenres, id_genre];
        return updatedGenres;
      }
    });
  };

  // Fungsi untuk menambah aktor dengan batas maksimal 8
  const handleActorAdd = (actor) => {
    if (actors.length >= 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Limit Reached',
        text: 'You can only add up to 8 actors.',
      });
      return;
    }

    // Cek jika aktor sudah ada di daftar berdasarkan id_actor
    if (actors.some((a) => a.id_actor === actor.id_actor)) {
      Swal.fire({
        icon: 'info',
        title: 'Duplicate Actor',
        text: `${actor.name} is already added to the list.`,
      });
      return;
    }

    if (!actors.includes(actor.name)) {
      setActors([...actors, actor]);
    }

    setSearchTerm(''); // Kosongkan input setelah memilih aktor
    setSearchResults([]); // Kosongkan hasil pencarian setelah memilih
  };

  const handleActorRemove = (index) => {
    setActors(actors.filter((_, i) => i !== index));
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64String = reader.result; // Base64 string of the image
      setPoster(base64String); // Temporary display and can be used for persistent storage
      setPosterLink(''); // Save this to the database as the poster URL
    };
  
    reader.readAsDataURL(file); // Triggers onloadend and reads file as Base64
  };
  
  const handlePosterLinkChange = (e) => {
    setPosterLink(e.target.value);
    setPoster(e.target.value);
  };

  const handleYearChange = (e) => {
    const inputYear = e.target.value;
    const currentYear = new Date().getFullYear();
  
    setYear(inputYear); // Set year terlebih dahulu untuk memastikan input selalu bisa diubah

    if (inputYear < 1900 || inputYear > currentYear) {
      setError((prevErrors) => ({
        ...prevErrors,
        year: `Please enter a year between 1900 and ${currentYear}`,
      }));
    } else {
      setError((prevErrors) => {
        const { year, ...rest } = prevErrors;
        return rest;
      });
    }
};


  const handleTrailerChange = (e) => {
    const input = e.target.value;
    setTrailer(input);

    // Regex untuk validasi URL
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.[a-z]{2,}(\/\S*)?$/;
    if (input && !urlPattern.test(input)) {
      setError((prevErrors) => ({
        ...prevErrors,
        trailer: 'Please enter a valid trailer link',
      }));
    } else {
      // Hapus error trailer jika valid
      setError((prevErrors) => {
        const { trailer, ...rest } = prevErrors;
        return rest;
      });
    }
  };

    const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Check if any required field is empty
    const requiredFields = ["title", "year", "country", "synopsis", "trailer", "poster"];
    let formErrors = {};

    // Loop melalui setiap field yang diperlukan (kecuali yang memiliki pesan khusus)
    requiredFields.forEach((field) => {
      if (!eval(field)) {
        formErrors[field] = requiredMessage;
      }
    });

    // Pengecualian untuk field dengan pesan error yang berbeda
    if (selectedGenres.length === 0) formErrors.genres = "Please select at least one genre";
    if (actors.length === 0) formErrors.actors = "Please add at least one actor";

    // Jika ada error, set ke state error dan hentikan submit
    if (Object.keys(formErrors).length > 0) {
      setError(formErrors);
      return;
    }

    const token = sessionStorage.getItem('token');
    let userId;
    const genreIds = selectedGenres.filter((id) => id !== null && id !== undefined);

    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id_user; // Pastikan ini sesuai dengan nama field di token JWT
    } else {
      console.error("User token is missing.");
    }

    fetch('http://localhost:5000/api/movie/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        altTitle,
        year,
        country,
        synopsis,
        genres: genreIds,
        actors,
        trailer,
        poster,
        id_user: userId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Movie added successfully!',
          });
          // Reset input fields after success
          setPoster('');
          setPosterLink('');
          setTitle('');
          setAltTitle('');
          setYear('');
          setCountry('');
          setSynopsis('');
          setSelectedGenres([]);
          setActors([]);
          setTrailer('');
      } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Failed to add movie.',
          });
      }
      })
      .catch((error) => {
        console.error('Error adding movie:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `An error occurred while adding the movie: ${error.message || error}`,
        });
      });
  };

  return (
    <div className="container-box">
      {/* Sidebar Section */}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        {/* Title Section */}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Input New Movie</h3>
        </div>

        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Poster</Form.Label>
                    <div className="mb-3">
                      {poster ? (
                        <img
                          src={poster}
                          alt="Poster Preview"
                          className="img-fluid mb-3"
                          style={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                          }}
                        />
                      ) : (
                        <div
                          className="mb-3"
                          style={{
                            width: '100%',
                            height: '400px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            color: '#ccc',
                          }}
                        >
                          <span>Image Preview</span>
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handlePosterUpload}
                        className="mb-2"
                      />
                      <Form.Control
                        type="text"
                        placeholder="Or enter image URL"
                        value={posterLink}
                        onChange={handlePosterLinkChange}
                      />
                      {error.poster && <small className="text-danger">{error.poster}</small>}
                    </div>
                    <Button className="btn btn-golden" type="submit">Submit</Button>
                  </Form.Group>
                </Col>

                <Col md={9}>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        {error.title && <small className="text-danger">{error.title}</small>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Alternative Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter alternative title"
                          value={altTitle}
                          onChange={(e) => setAltTitle(e.target.value)}
                        />                        
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter year"
                          value={year}
                          onChange={handleYearChange}
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                        {error.year && <small className="text-danger">{error.year}</small>}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label> 
                          <Form.Control
                            as="select"
                            value={country ? country.value : ''}
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                              <option key={country.name} value={country.name}>
                                {country.name}
                              </option>
                            ))}                            
                          </Form.Control>
                          {error.country && <small className="text-danger">{error.country}</small>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Synopsis</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={synopsis}
                      onChange={(e) => setSynopsis(e.target.value)}
                    />
                    {error.synopsis && <small className="text-danger">{error.synopsis}</small>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Add Genres</Form.Label>
                    <Row>
                      {genres.map((genre) => (
                        <Col key={genre.id_genre} xs={6} sm={4} md={3}>
                          <Form.Check
                            type="checkbox"
                            label={genre.name}
                            checked={selectedGenres.includes(genre.id_genre)}
                            onChange={() => handleGenreChange(genre.id_genre)}
                          />
                        </Col>
                      ))}
                    </Row>
                    {error.genres && <small className="text-danger">{error.genres}</small>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Add Actors (Up to 8)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search Actor Names"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={actors.length >= 8} // Nonaktifkan input jika sudah 8 aktor
                      autoComplete="off"
                    />
                    {/* Daftar hasil pencarian dalam bentuk dropdown scrollable */}
                    {searchResults.length > 0 && (
                      <div className="search-results-dropdown" style={{
                        position: 'auto',
                        maxHeight: '150px',  // Batasi tinggi dropdown
                        overflowY: 'auto',    // Tambahkan scroll jika hasil lebih dari 5
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        zIndex: 1000
                      }}>
                        {searchResults.map((actor) => (
                          <div
                            key={actor.id_actor}
                            onClick={() => handleActorAdd(actor)}
                            style={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              color: 'black',
                            }}
                            onMouseDown={(e) => e.preventDefault()} // Prevent loss of focus on input
                          >
                            {actor.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {error.actors && <small className="text-danger">{error.actors}</small>}
                    <Row>
                      {actors.map((actor, index) => (
                        <Col key={index} md={3} className="mb-3">
                          <Card className="h-100">
                            <Card.Body className="d-flex flex-column align-items-center">
                              <img
                                src={actor.photo || '/images/default-actor.jpg'} // Ganti dengan gambar default jika photoUrl tidak ada
                                alt={actor.name}
                                style={{
                                  width: '80px',
                                  height: '100px',
                                  borderRadius: '5px',
                                  margin: '10px',
                                  objectFit: 'cover',
                                }}
                              />
                              <Card.Title style={{ fontSize: '0.9rem', textAlign: 'center'}}>{actor.name}</Card.Title>
                              <Button
                                variant="danger"
                                size="s"
                                onClick={() => handleActorRemove(index)}
                              >
                                Remove
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>

                  <Row>
                      <Form.Group>
                        <Form.Label>Link Trailer</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter trailer link"
                          value={trailer}
                          onChange={handleTrailerChange}
                        />
                        {error.trailer && <small className="text-danger">{error.trailer}</small>}
                      </Form.Group>
                  </Row>
                </Col>
                
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MovieInputPage;
