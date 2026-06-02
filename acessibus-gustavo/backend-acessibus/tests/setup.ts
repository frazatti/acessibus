export default (): void => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
};
