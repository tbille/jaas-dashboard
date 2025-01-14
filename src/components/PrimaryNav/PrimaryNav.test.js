import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { mount } from "enzyme";

import PrimaryNav from "./PrimaryNav";

describe("Primary Nav", () => {
  let windowLocation = {};
  beforeEach(() => {
    windowLocation = global.window.location;
  });

  it("renders without crashing and matches snapshot", () => {
    const wrapper = mount(
      <Router>
        <PrimaryNav />
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("toggles external nav menu", () => {
    const wrapper = mount(
      <Router>
        <PrimaryNav />
      </Router>
    );

    const primaryNav = ".p-primary-nav";
    const primaryNavToggle = ".p-primary-nav__toggle";

    expect(wrapper.find(primaryNav).hasClass("ext-nav-open")).toEqual(false);
    wrapper.find(primaryNavToggle).simulate("click");
    expect(wrapper.find(primaryNav).hasClass("ext-nav-open")).toEqual(true);
    wrapper.find(primaryNavToggle).simulate("click");
    expect(wrapper.find(primaryNav).hasClass("ext-nav-open")).toEqual(false);
  });

  it("applies is-selected state correctly", () => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      pathname: "/logs"
    };
    const wrapper = mount(
      <Router>
        <PrimaryNav />
      </Router>
    );
    expect(wrapper.find(".is-selected a").text()).toStrictEqual("Logs");
  });

  afterEach(() => {
    global.window.location = windowLocation;
  });
});
