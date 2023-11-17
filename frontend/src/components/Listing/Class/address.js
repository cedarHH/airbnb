class Address {
    constructor (street, city, state, zipCode, unit = '') {
      this.street = street;
      this.city = city;
      this.state = state;
      this.zipCode = zipCode;
      this.unit = unit;
    }
  }
  
  export default Address;