<script>
  import { getUser, getUserFollowers } from "$lib/github";
  import * as d3 from "d3";
  import { onMount } from "svelte";

  /** @type {HTMLDivElement} */
  let wrapper;

  let username = "";

  let cities = null;

  /** @type {d3.GeoPath<any, d3.GeoPermissibleObjects>} */
  let path = null;

  let user = null;
  let following = [];
  let followers = [];

  const findUser = async () => {
    if (username === "") return;

    user = null;
    following = [];
    followers = [];

    d3.selectAll("circle.city").remove();

    [user, followers, following] = await Promise.all([
      getUser(username),
      getUserFollowers(username),
      getUserFollowers(username),
    ]);

    username = "";
  };

  onMount(async () => {
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;

    const projection = d3.geoMercator().translate([w / 2, h / 1.5]);

    path = d3.geoPath().projection(projection);

    const svg = d3
      .select(wrapper)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // TODO: find json but with cities
    const countriesUrl =
      "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json";
    const citiesUrl =
      "https://raw.githubusercontent.com/drei01/geojson-world-cities/master/cities.geojson";

    const json = await d3.json(countriesUrl);
    cities = await d3.json(citiesUrl);

    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "dimgray")
      .attr("fill", "#ccc");

    svg
      .selectAll("text")
      .data(json.features)
      .enter()
      .append("text")
      .attr("fill", "#000")
      .attr("transform", (d) => `translate(${path.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text((d) => d.name);
  });

  $: {
    if (user?.location && cities) {
      const data = cities.features.filter((city) => {
        const name = city.properties.NAME;
        return new RegExp(`${name.toLowerCase()}`).test(
          user.location.toLowerCase()
        );
      });

      const svg = d3.select(wrapper).selectChild("svg");

      svg
        .selectAll("circle.city")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "city")
        .attr("cx", (d) => path.centroid(d)[0])
        .attr("cy", (d) => path.centroid(d)[1])
        .attr("r", 5)
        .attr("fill", "#000");
    }
  }
</script>

<div>
  <header class="flex flex-col items-center gap-4 my-2">
    <h1 class="text-center text-3xl font-semibold">GitHub Map</h1>
    <form on:submit|preventDefault={findUser}>
      <input bind:value={username} class="border py-1 px-2 rounded" />
      <button
        type="submit"
        class="border py-1 px-4 rounded transition-colors hover:bg-neutral-300"
        >find</button
      >
    </form>
  </header>
  <div class="h-[700px]" bind:this={wrapper} />
</div>
