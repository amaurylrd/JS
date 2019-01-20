function $_GET(param)
{
    var vars = {};

    var decoded = decodeURI(window.location.href);
    log(decoded);

    window.location.href.replace( location.hash, '' ).replace( 
        /[?&]+([^=&]+)=?([^&]*)?/gi,
        function(m, key, value)
        {
            vars[key] = value !== undefined ? value : '';
        }
    );

    if (param)
        return vars[param] ? vars[param] : null;
    
    return vars;
}

function Singleton()
{
    var input = $_GET('input_name').toUpperCase();
    this.querries = input.split(helper[0]);

  	if (Singleton.caller != Singleton.getInstance)
  		throw new Error("This object cannot be instanciated");

    this.isEmpty = function()
    {
        return this.querries.length == 0;
    };

    this.next = function()
    {
        return this.querries.pop();
    };

    this.get = function()
    {
        var last = this.querries.length - 1;
        return this.querries[last];
    };

    this.split = function()
    {
        var last = this.querries.length - 1;

        var res = this.querries[last];
        var regex = /d/gi;

        for (let i = 0 ; i< this.querries.length ; i++)
        {
            res = res.replace(new RegExp(/\d/), function(str) 
            {
                if (str === helper[1])
                    return ' et ';
            });
        }
        
        return res;
    };
}

Singleton.instance = null;

Singleton.getInstance = function()
{
  	if (this.instance == null)
   		this.instance = new Singleton();
  	
    return this.instance;
}

var register = null;
var P = [];
var superviser;

function init()
{
    results = get_dictionary();
    register = results.population;
    superviser =
    {
        alpha: 0.1,
        q: 1 / results.count,
        scope: 100
    };
    run(results.count);
}

function run(count)
{
    while (!Singleton.getInstance().isEmpty())
    {
        set_matrix(count);
        matrix_parse();
        matrix_fill();
        var lader = matrix_sort();
        display(lader, Singleton.getInstance().split());
        Singleton.getInstance().next();
    }
}

//Lists all students in an index
function get_dictionary()
{
    class Student
    {
        constructor(num, login, name)
        {
            this.etu_num = num;
            this.login = login;
            this.name = name;

            this.score = 0.0;
        }

        toString()
        {
            return this.login+" "+this.etu_num;
        }
    };

    var population = new Array();
    var count = 0;

    for (let key in logins)
    {
        if (logins.hasOwnProperty(key))
        {
            population[key] = new Student(count, key, logins[key]);
            count++;
        }
    }

    return {population, count};
}

//Prepares the matrix
function set_matrix(length)
{
	P = gen(length);

	for (let m = 0 ; m < length ; m++)
        for (let p = 0 ; p < length ; p++)
            P[m][p] = 0.0;
}

//Generates a matrix
function gen(length)
{
    var array = new Array(length);
    
    for (let i = 0 ; i < length ; i++)
        array[i] = new Array(length);

    return array;
}

//Grants each vote a weight
function matrix_parse()
{
    for (login in votes)
    {
        var querry = Singleton.getInstance().get();
        querry = querry.split(helper[1]);
        
        for (lesson in querry)
        {
            if (register[login] != null)
            {
                var candidates = votes[login][querry[lesson]];
                var students = new Array();

                for (let i = 0 ; i < candidates.length ; i++)
                {
                    var candidate = candidates[i];

                    if (candidate != login && register[candidate] != null)
                        students.push(candidate);
                }

                var length = students.length;
                var elector = register[login].etu_num;
                var weight;

                if (length != 0)
                {
                    weight = 1 / length;

                    for (let i = 0 ; i < length ; i++)
                    {
                        var student = students[i];
                        var elected = register[student].etu_num;

                        P[elector][elected] += weight;
                    }
                }
                else
                {
                    var range = P.length;
                    weight = 1 / (range - 1);

                    for (let i = 0 ; i < range ; i++)
                        if (i != elector)
                            P[elector][i] += weight;
                }
            }
        }
    }
}

function matrix_fill()
{
    var T = add_number(mult_number(P, 1 - superviser.alpha), superviser.alpha * superviser.q);
    P = quick_exp(T, superviser.scope);
}

//exponentiation rapide binaire
function quick_exp(M, n)
{
    if (n == 1)
        return M;
    else
    {
        if (n % 2 == 0)
        {    
            var R = quick_exp(M, n / 2);
            return mult_matrix(R, R);
        }
        else
        {
            var R = quick_exp(M, (n - 1) / 2);
            return mult_matrix(power_matrix(R, 2), M);
        }
    }
}

function power_matrix(M, scope)
{
    var dimension = M.length;
    var I = gen(dimension);
    
    for (let m = 0 ; m < dimension ; m++)
    {
        for (let p = 0 ; p < dimension ; p++)
        {
            I[m][p] = 0;
            if (m == p)
                I[m][p] = 1;
        }
    }

    for (let i = 0 ; i < scope ; i++)
        I = mult_matrix(I, M);

    return I;
}

function is_power(k)
{
    if (k == 0)
        return false;

    for (power = 1 ; power > 0 ; power = power << 1)
    {
        if (power == k)
            return true;
        else if (power > k)
            return false;
    }

    return false;
}

//Sums a matrix and a value
function add_number(M, value)
{
    var R = [];
    var dimension = M.length;

    for (let m = 0 ; m < dimension ; m++)
    {
        R[m] = [];
        for (let p = 0 ; p < dimension ; p++)
            R[m].push(M[m][p] + value);
    }

    return R;
}

//Multiplies a matrix and a value
function mult_number(M, value)
{   
    var R = [];
    var dimension = M.length;

    for (let m = 0 ; m < dimension ; m++)
    {
        R[m] = [];
        for (let p = 0 ; p < dimension ; p++)
            R[m].push(M[m][p] * value);
    }

    return R;
}

//Multiplies trow matrix
function mult_matrix(M1, M2)
{
    var R = [];
    
    for(let j = 0; j < M2.length; j++)
    {
        R[j] = [];
        for(let k = 0; k < M1[0].length; k++)
        {
            var sum = 0;
            for(let i = 0; i < M1.length; i++)
                sum += M1[i][k] * M2[j][i];
            R[j].push(sum);
        }
    }

    return R;
}

//Sums trow matrix
function add_matrix(M1, M2)
{
    var R = [];
    var dimension = M1.length;
   
    for (let m = 0 ; m < dimension ; m++)
    {
        R[m] = [];
        for (let p = 0 ; p < dimension ; p++)
            R[m].push(M1[m][p] + M2[m][p]);
    }

    return R;
}

//Sorts the matrix
function matrix_sort()
{
    var dimension = P.length;
    var vect = [];

    var m = 0;
    for (student in register)
    {
        var rank = 0;
        for (let p = 0 ; p < dimension ; p++)
            rank += P[m][p];
        vect.push([student, rank]);
        m++;
    }

    vect.sort(function(a, b)
    {
        return b[1] - a[1];
    });

    var lader = [];
    for (value in vect)
    {
        var login = vect[value][0];
        lader.push(register[login]);
    }

    return lader;
}