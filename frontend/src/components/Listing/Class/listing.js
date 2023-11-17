class Listing {
  constructor (id, title, propertyType, numberOfBeds, numberOfBathrooms, thumbnail, reviews, pricePerNight, published = false, availability, address, owner) {
    this.id = id;
    this.title = title;
    this.propertyType = propertyType;
    this.numberOfBeds = numberOfBeds;
    this.numberOfBathrooms = numberOfBathrooms;
    this.thumbnail = thumbnail;
    this.reviews = reviews;
    this.pricePerNight = pricePerNight;
    this.published = published;
    this.availability = availability;
    this.address = address;
    this.owner = owner
  }

  get averageRating () {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / this.reviews.length;
  }
}

export default Listing;
