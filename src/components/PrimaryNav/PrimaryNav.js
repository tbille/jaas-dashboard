import React from "react";
import { Link } from "react-router-dom";

function PrimaryNav() {
  return (
    <div>
      <header id="navigation" className="p-navigation is-dark">
        <div className="p-navigation__banner">
          <div className="p-navigation__logo">
            <a className="p-navigation__link" href="/">
              <img
                className="p-navigation__image"
                src="https://assets.ubuntu.com/v1/a9e0ed4a-jaas-logo1.svg"
                alt="JAAS logo"
                width="95"
              />
            </a>
          </div>
          <a
            href="#navigation"
            className="p-navigation__toggle--open"
            title="menu"
          >
            Menu
          </a>
          <a
            href="#navigation-closed"
            className="p-navigation__toggle--close"
            title="close menu"
          >
            Close menu
          </a>
        </div>
        <nav className="p-navigation__nav">
          <span className="u-off-screen">
            <a href="#main-content">Jump to main content</a>
          </span>
          <ul className="p-navigation__links" role="menu">
            <li className="p-navigation__link" role="menuitem">
              <a className="p-link--external" href="https://jaas.ai/jaas">
                About
              </a>
            </li>
            <li className="p-navigation__link" role="menuitem">
              <a
                className="p-link--external"
                href="https://discourse.jujucharms.com/"
              >
                Discourse
              </a>
            </li>
            <li className="p-navigation__link" role="menuitem">
              <a className="p-link--external" href="https://jaas.ai/docs">
                Docs
              </a>
            </li>
            <li className="p-navigation__link" role="menuitem">
              <a className="p-link--external" href="#_">
                Charmhub
              </a>
            </li>
            <li className="p-navigation__link" role="menuitem">
              <Link to="/">Settings</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default PrimaryNav;
