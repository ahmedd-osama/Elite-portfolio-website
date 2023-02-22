// paralex effect
var defaultDelay = '0s';
var defaultDuration = '0.05s';
var defaultTimingFunction = 'ease';
var parallexObjects = [];
// setting default options for parallex-move attribute
var defaultMoveValues = new Map;
defaultMoveValues.set('up', { name: 'up', value: function (element) { return [0, -element.getBoundingClientRect().height * 3]; } });
defaultMoveValues.set('static', { name: 'up', value: function (element) { return [0, -element.getBoundingClientRect().height * 3]; } });
// setting the intersection opserver
var parallexScrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        var element = entry.target;
        // setting the scrollEvent listener when the element is intersecting the view port
        if (entry.isIntersecting) {
            parallexObjects.map(function (object) {
                object.element == element ? object.state = true : "";
            });
        }
        else {
            parallexObjects.map(function (object) {
                object.element == element ? object.state = false : "";
            });
        }
    });
});
var parallexElements = Array.from(document.querySelectorAll('.parallex-item'));
parallexElements.forEach(function (element) {
    var _a, _b, _c;
    // calculating the position difference for each element and start position and end position
    {
        var computedTransform = ((_a = document.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(element).transform) != 'none' ? (_b = document.defaultView) === null || _b === void 0 ? void 0 : _b.getComputedStyle(element).transform : false;
        // console.log(computedTransform)
        // assigning the begining values of the element from the custom data attribute or fetching it from the computedStyle if the custom attribute is not defined
        var startPosition = element.getAttribute("parallex-start") ? element.getAttribute("parallex-start").split(',').map(function (element) { return parseInt(element); }) : computedTransform ? computedTransform.replace(' ', '').replace('matrix(', '').replace(')', '').split(',').splice(4).map(function (string) { return parseInt(string); }) : [0, 0];
        var endPosition = [0, 0];
        var parallexMove = element.getAttribute("parallex-move") ? element.getAttribute("parallex-move") : false;
        if (parallexMove) {
            if (defaultMoveValues.has(parallexMove.replace(' ', ''))) {
                endPosition = defaultMoveValues.get(parallexMove).value(element);
            }
            else {
                endPosition = parallexMove.split(',').map(function (element) { return parseInt(element); });
            }
        }
        else {
            // setting the "up" for a default value if the parallex-move attribute is not set
            endPosition = defaultMoveValues.get('up').value(element);
        }
        // assigning [0, window.innerHeight] to endPosition becasue it is set to be the default
        //setting different variations of parallex-move attribute
        var positionDifferenceX = endPosition[0] - startPosition[0];
        // console.log(`position diffrence x => ${positionDifferenceX}`)
        var positionDifferenceY = endPosition[1] - startPosition[1];
        // console.log(`position diffrence y => ${positionDifferenceY}`)
        // setting the object of the element and pushing it to the array 
        var elementObject = new Object;
        elementObject = {
            element: element,
            positionDifferenceX: positionDifferenceX,
            positionDifferenceY: positionDifferenceY,
            startPosition: startPosition,
            endPosition: endPosition,
            state: false
        };
        parallexObjects.push(elementObject);
    }
    // setting the transition delay and transition duration style properties
    {
        var delay = element.getAttribute("parallex-delay") ? element.getAttribute("parallex-delay") : defaultDelay;
        var duration = element.getAttribute("parallex-transition-duration") ? element.getAttribute("parallex-transition-duration") : defaultDuration;
        var timingFunction = element.getAttribute("parallex-timing-function") ? element.getAttribute("parallex-timing-function") : defaultTimingFunction;
        // console.log(`current properties==> ${delay} ${duration} ${timingFunction}`)
        var computedStyle = (_c = document.defaultView) === null || _c === void 0 ? void 0 : _c.getComputedStyle(element); //getting the computed styles of the element
        var defaultTransitionProperty = computedStyle.transitionProperty ? computedStyle.transitionProperty : false;
        var defaultTransitionPropertyArray = computedStyle.transitionProperty ? computedStyle.transitionProperty : false;
        if (computedStyle.transition != 'all 0s ease 0s') {
            // if there is a transition set for any property
            if (!defaultTransitionPropertyArray.includes('all')) {
                // checking if the transition is NOT set for 'all' properties on the element
                ;
                if (!(defaultTransitionProperty.replace(' ', '').split(',').includes('transform'))) {
                    //the transition is set to any proprities other than all and transform
                    element.style['transition'] = computedStyle.transition.concat(", transform ".concat(duration, " ").concat(timingFunction, " ").concat(delay));
                    // console.log(`current transition ==>${computedStyle.transition}`)
                }
                // console.log("no change")
            }
            // console.log('transition is set to all so there is no change')
        }
        else {
            // if there is NO transition set for any property, the transition will be automatically set for transform with the default values or the values provided in the element's custom parallex attributes
            element.style['transition'] = "transform ".concat(duration, " ").concat(timingFunction, " ").concat(delay);
            // console.log(`current transition ==>${computedStyle.transition}`)
        }
    }
    // assigning the opserver for each element 
    parallexScrollObserver.observe(element);
});
// setting the event listener
window.addEventListener('scroll', function () {
    parallexObjects.forEach(function (object) {
        if (object.state) {
            var element = object.element;
            var positionDifferenceX = object.positionDifferenceX;
            var positionDifferenceY = object.positionDifferenceY;
            var startPosition = object.startPosition;
            // setting percentage
            var percentageFromTop = element.getBoundingClientRect().top / window.innerHeight;
            var percentage = Math.abs(percentageFromTop - 1);
            // setting Max percentage
            var maxPercentage = (element.getBoundingClientRect().height + window.innerHeight) / window.innerHeight;
            if (!(percentage + 0.05 >= maxPercentage)) {
                var currentPositionDifferenceX = Math.round(percentage * positionDifferenceX);
                var currentPositionDifferenceY = Math.round(percentage * positionDifferenceY);
                element.style['transform'] = "translate(".concat(startPosition[0] + currentPositionDifferenceX, "px,").concat(startPosition[1] + currentPositionDifferenceY, "px)");
            }
        }
    });
});
// console.log(parallexObjects)
