/*
 * All the heavy lifting in this example is done by Ousteta,
 * including protecting the routes from unauthorized users.
 *
 * This approach is the same as when using Outseta
 * with no-code tools such as Webflow.
 *
 */

import { useEffect } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  Outlet,
  BrowserRouter,
  useSearchParams
} from "react-router-dom";

/*
 * Pop-up login, signup and profile docs:
 * https://go.outseta.com/support/kb/articles/By9q2qWA/how-to-integrate-outseta-s-sign-up-login-and-profile-embeds
 *
 */

const O_LOGIN_URL =
  "https://queen.outseta.com/auth?widgetMode=login#o-anonymous";
const O_SIGNUP_URL =
  "https://queen.outseta.com/auth?widgetMode=register#o-anonymous";
const O_PROFILE_URL = "https://queen.outseta.com/profile#o-authenticated";
const O_LOGOUT_URL = "/#o-logout-link";

/*
 * The routes are all wrapped with this component,
 * mounted once per page load.
 *
 */

function AppRoot({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Removing the access_token from the url is considered best practice
    // so that its not accidentally copied when sharing content.
    if (searchParams.get("access_token")) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return children;
}

/*
 * The App with common layout outside the routers
 *
 */

export default function App() {
  return (
    <BrowserRouter>
      <>
        <header>
          <h1>
            <NavLink to="/">New Profile Maker</NavLink>
          </h1>
          <nav>
            <a href={O_LOGIN_URL}>Login</a>
            <a href={O_SIGNUP_URL}>Signup</a>
            <a href={O_PROFILE_URL}>Profile</a>
            <a href={O_LOGOUT_URL}>Logout</a>
          </nav>
        </header>

        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/another">Another Public Page</NavLink>
          <NavLink to="/basic">Basic Content</NavLink>
          <NavLink to="/pro">Pro Content</NavLink>
        </nav>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <AppRoot>
                  <Outlet />
                </AppRoot>
              }
            >
              <Route>
                <Route
                  index
                  element={
                    <>
                      <h2>Home</h2>
                      <p>Home page visible to all.</p>
                    </>
                  }
                />
                <Route
                  path="/another"
                  element={
                    <>
                      <h2>Another Public Page</h2>
                      <p>Another page visible to all.</p>
                    </>
                  }
                />

                <Route path="/basic">
                  {/*
                   * Routes starting with "basic" is set to be protected
                   * in the Outseta dashboard. Allowed plans are basic and pro.
                   *
                   * Docs: https://go.outseta.com/support/kb/articles/z49EBLW7/how-to-protect-content-so-it-s-only-accessible-to-members-or-subscribers
                   *
                   */}
                  <Route
                    index
                    element={
                      <>
                        <h2>Members only content</h2>
                        <p>Content available for all plans.</p>
                        <p>
                          Check out some more{" "}
                          <Link to="another">member only content</Link>.
                        </p>
                      </>
                    }
                  />

                  <Route
                    path="another"
                    element={
                      <>
                        <h2>More members only content</h2>
                        <p>Content available for all plans.</p>
                        <p>
                          <Link to="..">Go back</Link>
                        </p>
                      </>
                    }
                  />
                </Route>

                <Route path="pro">
                  {/*
                   * Routes starting with "pro" is set to be protected
                   * in the Outseta dashboard. Allowed plan is pro.
                   *
                   * Docs: https://go.outseta.com/support/kb/articles/z49EBLW7/how-to-protect-content-so-it-s-only-accessible-to-members-or-subscribers
                   *
                   */}
                  <Route
                    index
                    element={
                      <>
                        <h2>Pro Members only content</h2>
                        <p>
                          Content available on the <strong>pro</strong> plans.
                        </p>
                        <p>
                          Check out some more{" "}
                          <Link to="another">pro only content</Link>.
                        </p>
                      </>
                    }
                  />

                  <Route
                    path="another"
                    element={
                      <>
                        <h2>More members only content</h2>
                        <p>Content available for all plans.</p>
                        <p>
                          <Link to="..">Go back</Link>
                        </p>
                      </>
                    }
                  />
                </Route>

                <Route
                  path="*"
                  element={
                    <>
                      <h2>Not found</h2>
                      <p>There's nothing here!</p>
                    </>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </main>
      </>
    </BrowserRouter>
  );
}
