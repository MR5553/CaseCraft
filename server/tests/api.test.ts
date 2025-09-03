describe("Math test", () => {
    beforeAll(() => console.log("beforeAll runs"));
    afterAll(() => console.log("afterAll runs"));

    it("adds 2 + 2", () => {
        expect(2 + 2).toBe(4);
    });
});