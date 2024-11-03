# Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app@14`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

1. First, install the dependencies:
   ```bash
   npm i
   ```
2. Copy .env.example to .env.local and set the environment variables.

   ```bash
   cp .env.example .env.local
   ```

   pwsh

   ```pwsh
   Copy-Item ".env.examle" -Destination ".env"
   ```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

###### Frame Data

On development mode, `npm run dev` this app relays on local data to load the 50 frames. You can get all the data [here](https://drive.google.com/file/d/1Gem2PZmAcAaBp-g_EkIcXJVp9DXd9lko/view?usp=sharing). Place the `data` folder in `src/data`. If you prefere to load the data remotel, be sure to set the `USE_LOCAL_DATA` falg in `.env` to `false`

## Resources

https://r3f.docs.pmnd.rs/getting-started/introduction react three fiber documentation.

https://drei.docs.pmnd.rs/misc/htm to create the tool tip.

https://discoverthreejs.com/tips-and-tricks/ performance & research.

https://discourse.threejs.org/t/how-can-i-optimise-my-three-js-rendering/42251 performance & research.

https://threejsfundamentals.org/threejs/lessons/threejs-tips.html performance & research.

https://chatgpt.com/ initial project bootstrap.

https://google.com/ a lot, for everything.

### Known Issues

- The tooltip is not working properly on mobile devices.
- The tooltip is not workine as expected on desktop, when you hover the tooltip this is hidden. That is not the intended functionality.
- The controls are set on a fixed position, this is not the best approach for mobile devices. Or different screen sizes
- For some reason the points, on animation, are not being updated correctly. So as a workaround, I'm removing the points and adding them again once the user stop the animation. This is not the best approach, but it's working for now.

### Roadmap

- Improve performance.
- Fix the tooltip for desktop.
- Create a better approach for the controls.
- Add testing.

### Oddities

- For some reason, im new to r3f, is like the axis coords from the json dont match the axis coords from the r3f. So I had to change the order of the coords to make it work.
  eg:
  ```js
  sphere.position.set(y, z, x); // x, y, z
  ```

#### Authro

maikinahara[at]gmail[dot]com
