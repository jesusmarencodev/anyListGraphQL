<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Dev

1. Copiar el ```.env.template``` y renombrar a ```.env```
2. Ejecutar

```
  yarn install o npm install
```

3. Levantar la imagen (Docker desktop)

```
  docker compose up -d
```

4. Levantar el backend de NestJs


```
yarn start:dev
```

5. Visitar el sitio


```
  localhost:3000/graphql
```

6. Ejecutar la __"mutation"__  executeSeed para llenar la db con informacion