import { getMission } from "@/data/site";
export type ContactFields = {
  name: string;
  email: string;
  message: string;
  mission: string;
  website: string;
};
export type ContactErrors = Partial<
  Record<"name" | "email" | "message", "" | string>
>;
export function validateContact(input: Partial<ContactFields>): ContactErrors {
  const errors: ContactErrors = {};
  if (!input.name?.trim() || input.name.trim().length < 2)
    errors.name = "Please enter your name (at least 2 characters).";
  else if (input.name.length > 100)
    errors.name = "Please keep your name under 100 characters.";
  if (
    !input.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    input.email.length > 254
  )
    errors.email = "Please enter a valid email address.";
  if (!input.message?.trim() || input.message.trim().length < 20)
    errors.message = "Tell me a little more (at least 20 characters).";
  else if (input.message.length > 5000)
    errors.message = "Please keep your message under 5,000 characters.";
  return errors;
}
export function missionLine(id: string) {
  const mission = getMission(id);
  return mission ? `I’d like to discuss ${mission.title.toLowerCase()}.` : "";
}
export function updateMissionMessage(
  message: string,
  previous: string,
  next: string,
) {
  const oldLine = missionLine(previous);
  let body = message;
  if (oldLine && body.startsWith(oldLine))
    body = body.slice(oldLine.length).replace(/^\n{1,2}/, "");
  const newLine = missionLine(next);
  return newLine ? `${newLine}${body ? "\n\n" + body : ""}` : body;
}
