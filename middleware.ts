//TODO: (1) remove TeamCode page bcoz. it is same as joinTeam page (functionality should be retained)
//TODO: (2) add User interface to the types folder for reusability

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware"

interface User {
  id: string;
  email: string;
  name: string;
  hasFilledDetails?: boolean;
  events?: number[];
  event1TeamRole?: number;
  event2TeamRole?: number;
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  const user : User|null = token?.user as User;

  console.log(user);

  if (!token && !(path === "/")) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  //? Check if user is trying to go to an event page without signin
  if (!user && path.startsWith("/events")) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  //? Check if user is trying to fill user details again
  //? If yes, redirect to root route
  if (user && user.hasFilledDetails && (
    path.startsWith('/userDetails') || 
    path.startsWith('/events/pioneira/detailsForm')
  )) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (user && !user.hasFilledDetails && !user.email.endsWith("@vitstudent.ac.in") && path.startsWith('/userDetails')) {
    return NextResponse.redirect(new URL('/events/pioneira/detailsForm', request.url))
  }
  
  if (user) {
    const match = path.match(/\/events\/event(\d+)\b/);
    if (match) {
      const eventNumber = parseInt(match[1], 10);

      //? Check for a valid event number
      //? If not redirect to root route
      if (eventNumber < 1 || eventNumber > 5) {
        return NextResponse.redirect(new URL('/', request.url))
      }


      //? Check if the user is a participant for the event
      //? If not redirect to root route
      if (!user.events || !user.events.includes(eventNumber)) {
        return NextResponse.redirect(new URL('/', request.url))
      }


      //? Check if it is event1
      if (eventNumber === 1) {
        //? Check if the user has an event1TeamRole. i.e, if the user is part of a team or not
        //? If not, and the page is not joinTeam or createTeam page
        //? Redirect to createTeam page
        if ((user.event1TeamRole === undefined || user.event1TeamRole === null) && !(
          path.startsWith('/events/event1/createTeam') ||
          path.startsWith('/events/event1/joinTeam') ||
          path.startsWith('/events/event1/userConsent')
        )) {
          return NextResponse.redirect(new URL('/events/event1/createTeam', request.url))
        }

        //? Check if the user has an event1TeamRole. i.e, if the user is part of a team or not
        //? If yes and the page is joinTeam or createTeam
        //? Redirect to the Dashboard
        if (user.event1TeamRole !== undefined && user.event1TeamRole !== null && (
          path.startsWith('/events/event1/joinTeam') ||
          path.startsWith('/events/event1/createTeam')
        )) {
          //? If teamRole == 0 (leader)
          if (user.event1TeamRole === 0) {
            return NextResponse.redirect(new URL('/events/event1/leaderDashboard', request.url))
          }

          //? If teamRole == 1 (member)
          if (user.event1TeamRole === 1) {
            return NextResponse.redirect(new URL('/events/event1/memberDashboard', request.url))
          }
        }

        //? Check if leader is trying to access the member dashboard
        if (user.event1TeamRole === 0 && path.startsWith('/events/event1/memberDashboard')) {
          return NextResponse.redirect(new URL('/events/event1/leaderDashboard', request.url))
        }

        //? Check if member is trying to access the leader dashboard
        if (user.event1TeamRole === 1 && path.startsWith('/events/event1/leaderDashboard')) {
          return NextResponse.redirect(new URL('/events/event1/memberDashboard', request.url))
        }
      }
    } else {
      console.log("No event number found in the pathname.");
    }
  }
}

export const config = {
  matcher: [
    '/userDetails',
    '/events/:path*'
  ]
}