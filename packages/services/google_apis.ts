export async function get_location() {
  // const res = await fetch(
  //   `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  //   { method: 'POST' },
  // );

  // const data = await res.json();

  // return data.location;
  // await getNearestParkings(16.4989734, 80.6521139, 5, 100);

  return {
    lat: getRandomBetween(16),
    lng: getRandomBetween(80),
  };
}

function getRandomBetween(n: number) {
  const m = n + 1;
  const random = Math.random() * (m - n) + n;
  return Number(random.toFixed(7));
}
