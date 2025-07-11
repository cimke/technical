
# technical-task

The goal of this task is to complete this incomplete service while adding an GraphQL entrypoint for it.
Existing service consists of domain and persistance, your part here is to expose it to network by adding GraphQL HTTP handler.

You can add whatever packages you feel like is missing. You are free to choose GraphQL driver(Apollo, Mercurious, etc.).
Given code can be modified and improved to your desires.

Project should run on docker and development environment should be set up.

### Notes
GraphQL playgrounds should be acessible via `/graphiql` endpoint.
Unit testing is optional, but at least one test would be appreciated. 
Service needs to run in Docker.

```
Don't spend too much time making everything perfect. The idea of this test is to showcase the knowledge of concepts and practices.
```

## Extra points

This is purely optional. Showcase your GraphQL schema stiching knowledge by modifying code and giving this microservice an ability to extend parent resource as given below.
Extend TeamResource with array of players using this microservice.
NOTE: You don't have to code "Team" microservice to test, sketch it out from this service perspective and showcase the concept and execution.

```typescript
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class TeamResource {
  @Field()
  @Directive('@external')
  readonly id!: string;
}
```

### Run a migration
```
  run migration:docker-compose exec app npm run mikro-orm migration:up
```