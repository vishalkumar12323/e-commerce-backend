import bcrypt from "bcrypt";

export const hashPass = async (password: string) => {
  try {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

export const comparePass = async (password: string, hashedPass: string) => {
  try {
    return await bcrypt.compare(password, hashedPass);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Error comparing password");
  }
};
