var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var JSONArea = (function (_super) {
    __extends(JSONArea, _super);
    function JSONArea(props) {
        _super.call(this, props);
        var value = props.value, _a = props.space, space = _a === void 0 ? '  ' : _a;
        var json = JSON.stringify(value, null, space);
        this.state = { json: json };
    }
    JSONArea.prototype.componentWillReceiveProps = function (nextProps) {
        var value = nextProps.value, _a = nextProps.space, space = _a === void 0 ? '  ' : _a;
        if (value !== this.props.value) {
            var json = JSON.stringify(value, null, space);
            this.setState({ json: json });
        }
    };
    JSONArea.prototype.onChange = function (ev) {
        var textarea = ev.target;
        var json = textarea.value;
        this.setState({ json: json });
        try {
            var value = JSON.parse(json);
            this.setState({ error: undefined });
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        }
        catch (exc) {
            var error = exc.message.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
            this.setState({ error: error });
        }
    };
    JSONArea.prototype.render = function () {
        var _a = this.state, json = _a.json, error = _a.error;
        var result_className = error ? 'invalid' : 'valid';
        var result_content = error ? "Invalid JSON: " + error : 'Valid JSON';
        return (React.createElement("div", {"className": this.props.className}, React.createElement("textarea", {"value": json, "style": this.props.style, "onChange": this.onChange.bind(this)}), React.createElement("div", {"className": result_className}, result_content)));
    };
    return JSONArea;
})(React.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JSONArea;
