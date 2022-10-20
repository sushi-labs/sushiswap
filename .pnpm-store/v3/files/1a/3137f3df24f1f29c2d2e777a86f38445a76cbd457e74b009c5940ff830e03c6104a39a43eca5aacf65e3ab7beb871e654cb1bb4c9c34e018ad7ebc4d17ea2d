describe("Testing bigint support", function(){

    let nativeJSON = { 
        parse: JSON.parse,
        stringify: JSON.stringify,
     };
    require('../dist');

    var input = '{"big":9223372036854775807,"small":123}';

    it("Should show classic JSON.parse lacks bigint support", function(done){
        var obj = nativeJSON.parse(input);
        expect(obj.small.toString()).toEqual("123");
        expect(obj.big.toString()).not.toEqual("9223372036854775807");

        var output = nativeJSON.stringify(obj);
        expect(output).not.toEqual(input);
        done();
    });

    it("Should show JSONbig does support bigint parse/stringify roundtrip", function(done){
        var obj = JSON.parse(input);
        expect(obj.small.toString()).toEqual("123");
        expect(obj.big.toString()).toEqual("9223372036854775807");

        var output = JSON.stringify(obj);
        expect(output).toEqual(input);
        done();
    });
});
