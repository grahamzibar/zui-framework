(function() {

    // calculate the log of a number with a specified base
    ZUI.Math.log = function(number, base) {
        return Math.log(number) / Math.log(base);
    };

    // calculate mean for a group of numbers
    ZUI.Math.mean = function(numbers) {
        var sum = 0;
        for (var n = 0; n < numbers.length; n++) {
            sum += numbers[n];
        }
        return sum / numbers.length;
    };

    // calculate standard deviation for a group of numbers
    ZUI.Math.stDev = function(numbers) {
        if (numbers.length < 2) return Number.NaN;
        var mean = ZUI.Helper.mean(numbers);
        var sqSum = 0;
        for (var n = 0; n < numbers.length; n++) {
            sqSum += Math.pow(mean - numbers[n], 2);
        }
        return Math.sqrt(sqSum / (numbers.length - 1));
    };

    // calculate standard error for a group of numbers
    ZUI.Math.stError = function(numbers) {
        if (numbers.length < 2) return Number.NaN;
        return ZUI.Helper.stdev(numbers) / Math.sqrt(numbers.length);
    };

})();