import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { Website } from "@prisma/client";
import { Fragment } from "react";
import { Link, Form } from "remix";
import classNames from "~/utils/class-names";
import { generateWebsiteColor, generateWebsiteInitials } from "~/utils/website";

type Props = {
  website: Website;
};

export default function WebsiteListItem({ website }: Props) {
  return (
    <div className="flex">
      <div
        className={classNames(
          generateWebsiteColor(website.name),
          "flex-shrink-0 flex items-center justify-center w-16 text-white text-xl font-medium rounded-l-md shadow-sm"
        )}
      >
        {generateWebsiteInitials(website.name)}
      </div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-slate-200 bg-white rounded-r-md truncate shadow-sm">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <Link
            to={`/app/websites/details/${website.id}`}
            className="block text-slate-900 font-medium hover:text-slate-600"
          >
            {website.name}
          </Link>

          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-slate-500 hover:text-slate-600 hover:underline"
          >
            {website.url}
          </a>
        </div>
        <div className="flex-shrink-0 pr-2"></div>
      </div>
      <Menu as="div" className="relative ml-1 inline-block text-left">
        <div>
          <Menu.Button className="w-6 h-6 bg-white inline-flex items-center justify-center text-slate-400 rounded-full bg-transparent hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`/app/websites/details/${website.id}`}
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Details
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`/app/dashboard/${website.id}`}
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Dashboard
                  </Link>
                )}
              </Menu.Item>
              <Form method="post" action={`/app/websites/delete/${website.id}`}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? "text-slate-100 bg-red-700" : "text-red-700",
                        "block w-full text-left px-4 py-2 text-sm"
                      )}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </Form>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
