# Quotes of the Day

## Technology Stack
- **Backend:** Node.js (Express.js)
- **Client Application:** React
- **External API:** [FavQs API](https://favqs.com/api)

---

## Installation and running the code

1. **Clone the Repository**
   ```bash
   git clone https://github.com/avitalk1/QuotesOfTheDayAssigment.git
   ```

2. **Install Server Dependencies**
   ```bash
   cd QuotesOfTheDayNodeJs
   npm install
   ```

3. **Set Environment Variables**
   Create a `.env` file and set the following variables:
   ```env
   FAVQS_API_KEY=<your_favqs_api_key>
   PORT=3001
   ```

4. **Start the Server**
   ```bash
   npm start
   ```
5. **Install Server Dependencies**
    ```bash 
   cd quotes-of-the-day-app
   npm install
    ```
6. **Start the Client Application**
   ```bash
   npm start
   ```
---

## API Usage

### Random Quotes Endpoint
**POST /randomQuotes**
- **Description:** Returns a random list of quotes.
- **Query Parameters:**
  - `numOfQuotes` (required): The number of quotes to retrieve.
  - `page` (optional): to support pagination for the client side 
  - `type` (optional): the type of the filter to filter by 
  - `filter`(optional): the filter to filter by


---

## Technical Details

### Addressing the FavQs API Rate Limit

According to the FavQs API documentation, there is a rate limit of **30 requests per 20 seconds**, and the `Rate-Limit-Remaining` header should indicate the remaining request allowance. However, during testing, the following issues were noted:

1. The `Rate-Limit-Remaining` header was not present in the API responses.
2. There was no clear indication of rate limiting being enforced.

#### My Solution:

To address this potential rate limit issue and ensure compliance:
1. **Rate Limiting:** I implemented a rate limit on the server side to restrict the function that calls the FavQs API to a maximum of 30 requests per 20 seconds. This safeguards against exceeding the stated limit, even if it isn't explicitly enforced by the API.
2. **Request Queue:** Requests are processed in a queue with a delay between consecutive API calls, ensuring that the rate limit is respected.

These steps demonstrate my understanding of handling external API limitations while ensuring reliable service delivery.

---

## Author
Avital Nivon

