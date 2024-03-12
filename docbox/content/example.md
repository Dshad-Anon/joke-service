This is our high-quality Jokes API. You can use this API to request
and remove different jokes.

### Random joke

Retrieve a random joke from all jokes in the database

```endpoint
GET /jokes/random
```

#### Example request

```curl
$ curl http://localhost:3000/jokes/random
```
#### Example response

```json
{
    "id": 2,
    "joke_text": "Did you hear oxygen went on a date with potassium? It went OK.",
    "category_id": 1,
    "likes": 1,
    "dislikes": 0,
    "category_name": "Science"
}
```

 ### Random joke from a category of jokes

Retrieve a random joke from a category of jokes

```endpoint
GET /jokes/random/:category
```

#### Example request

```curl
curl http://localhost:3000/jokes/random/Science
```

#### Example response

```json
{
    "id": 5,
    "joke_text": "What did the thermometer say to the graduated cylinder? You may have graduated, but I've got many degrees.",
    "category_id": 1,
    "likes": 7,
    "dislikes": 0
}
```

 ### Retrive lists of categories

Retrieve  lists of categories from database

```endpoint
GET /categories
```

#### Example request

```curl
curl http://localhost:3000/categories
```

#### Example response

```json
    {
        "id": 1,
        "name": "Science"
    },
    {
        "id": 2,
        "name": "Engineering"
    },
    {
        "id": 3,
        "name": "Ironic"
    }
```
### Retrieve all jokes for a category 

Retrieve all jokes using category name

```endpoint
GET /jokes/:category
```

#### Example request

```curl
curl http://localhost:3000/jokes/Engineering
```

#### Example response

```json
    {
        "id": 3,
        "joke_text": "What does software engineer when then face problem they push back and run again",
        "category_id": 2,
        "likes": 0,
        "dislikes": 0
    },
    {
        "id": 4,
        "joke_text": "Why was the computer cold? It left its Windows open.",
        "category_id": 2,
        "likes": 1,
        "dislikes": 0
    }
```

### Joke by ID

Retrive a joke by ID

```endpoint
GET /joke/:id
```

#### Example request

```curl
curl http://localhost:3000/joke/3
```

#### Example response

```json
{
    "id": 3,
    "joke_text": "What does software engineer when then face problem they push back and run again",
    "category_id": 2,
    "likes": 0,
    "dislikes": 0
}
```

### Add a new category of joke

 

```endpoint
POST /categories
```

#### Example request

```curl
curl -X POST -H "Content-Type: application/json" -d "{ \"name\": \"New_Category\" }" http://localhost:3000/categories
```

#### Example request body

```json
{
    "name": "New_Category"
}
```

#### Example response

```json
{
    "message": "Category added successfully",
    "id": 4
}
```

### Add a new joke to a category

```endpoint
POST /jokes/:category
```

#### Example request

```curl
curl -X POST -H "Content-Type: application/json" -d "{ \"category\":\"New_Category\" ,\"joke_text\": \"Your Joke.\" }" http://localhost:3000/jokes/New_Category
```

#### Example request body

```json
{
    "category": "New_Category",
    "joke_text": "Your Joke"
}
```

#### Example response

```json
{
    "message": "Joke added successfully",
    "id": 8
}
```

### Add existing joke to a category by joke id

Add an existing joke to a category by joke id (a joke can belong in multiple categories) 

```endpoint
POST /joke/:id/category/:category
```

#### Example request

```curl
curl -X POST http://localhost:3000/joke/1/category/New_Category
```
#### Example request body

```json
{
    "id":1,
    "category": "New_Category"
    
}
```


#### Example response

```json
{
    "message": "Joke copied to new category successfully",
    "id": 9
}
```

### Give a like or dislike


```endpoint
POST /joke/:id/:type
```

#### Example request for Like

```curl
curl -X POST http://localhost:3000/joke/9/like
```
#### Example response for like

```json
{
    "message": "Vote recorded successfully for like"
}
```

#### Example request for dislike

```curl
curl -X POST http://localhost:3000/joke/8/dislike
```

#### Example response for dislike

```json
{
    "message": "Vote recorded successfully for dislike"
}
```

